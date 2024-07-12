import { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import connect from '../../database/connect'

interface OrderItem {
    productId: number;
    quantity: number;
}

interface CreateOrderRequest {
    body: {
        orderDate: Date;
        orderItems: OrderItem[];
    };
}

export default async function createOrder(req: CreateOrderRequest): Promise<void> {
    const { orderItems, orderDate } = req.body;
    const connection: Connection = await connect();
    try {
        await connection.beginTransaction();
        let totalAmount = 0;
        for (const item of orderItems) {
            const { productId, quantity } = item;
            const priceQuery = 'SELECT price FROM Product WHERE id = ?';
            const [price] = await connection.execute<RowDataPacket[]>(priceQuery, [productId]);
            totalAmount += price[0].price * quantity;
        }
        const orderQuery = 'INSERT INTO `Order` (orderDate, totalAmount) VALUES (?, ?)';
        const orderValues = [orderDate, totalAmount];
        const [orderResult] = await connection.execute<ResultSetHeader>(orderQuery, orderValues);

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            const { productId, quantity } = item;

            const orderItemQuery = 'INSERT INTO OrderItem (quantity, price, orderId, productId) VALUES (?, ?, ?, ?)';
            const orderItemValues = [quantity, totalAmount, orderId, productId];
            await connection.execute(orderItemQuery, orderItemValues);

            const updateStockQuery = 'UPDATE Stock SET quantity = quantity - ? WHERE productId = ?';
            const updateStockValues = [quantity, productId];
            await connection.execute(updateStockQuery, updateStockValues);
        }
        await connection.commit();

        console.log('Order created successfully');
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {

        await connection.end();
    }
}

