
import {ResultSetHeader } from 'mysql2';
import connect from '../../database/connect';

interface CreateProductRequest  {
    body: {
        productName: string;
        description: string;
        price: number;
        categoryId: number;
        quantity: number;
    };
}

export default async function createProduct(req: CreateProductRequest) {

    const { productName, description, price, categoryId, quantity } = req.body;

    const connection = await connect();

    try {
        await connection.beginTransaction();

        const query = 'INSERT INTO Product (name, description, price, categoryId) VALUES (?, ?, ?, ?)';
        const values = [productName, description, price, categoryId];

        const [result] = await connection.execute<ResultSetHeader>(query, values);
        const productId = result.insertId;

        const stockQuery = 'INSERT INTO Stock (quantity, productId) VALUES (?, ?)';
        const stockValues = [quantity, productId];
        const [stockResult] = await connection.execute<ResultSetHeader>(stockQuery, stockValues);

        await connection.commit();
        console.log('Product and stock created successfully', { result, stockResult });
    } catch (error) {
        await connection.rollback();

    } finally {
        await connection.end();
    }
}
