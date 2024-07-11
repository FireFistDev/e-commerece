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

            // Query the product price
            const priceQuery = 'SELECT price FROM Product WHERE id = ?';
            const [price] = await connection.execute<RowDataPacket[]>(priceQuery, [productId]);
            totalAmount += price[0].price * quantity;
        }

    //     // Insert the order into the Order table
        const orderQuery = 'INSERT INTO `Order` (orderDate, totalAmount) VALUES (?, ?)';
        const orderValues = [orderDate, totalAmount];
        const [orderResult] = await connection.execute<ResultSetHeader>(orderQuery, orderValues);

    //     // Get the generated order ID
        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            const { productId, quantity } = item;

            // Insert the order item into the OrderItem table
            const orderItemQuery = 'INSERT INTO OrderItem (quantity, price, orderId, productId) VALUES (?, ?, ?, ?)';
            const orderItemValues = [quantity , totalAmount, orderId, productId];
            await connection.execute(orderItemQuery, orderItemValues);

            // Update the stock quantity in the Stock table
            const updateStockQuery = 'UPDATE Stock SET quantity = quantity - ? WHERE productId = ?';
            const updateStockValues = [quantity, productId];
            await connection.execute(updateStockQuery, updateStockValues);
        }

        // Commit the transaction
        await connection.commit();

        console.log('Order and order items created successfully');
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        console.error('Error creating order and order items:', error);
        throw error;
    } finally {
        // Close the connection
        await connection.end();
    }
}

// // Example usage
// createOrder({
//     body: {
//         orderDate: new Date(),
//         orderItems: [
//             { productId: 1, quantity: 5 },
//         ]
//     }
// });
