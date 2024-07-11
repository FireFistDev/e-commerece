import { Connection, ResultSetHeader } from 'mysql2/promise';
import connect from '../../database/connect';

interface CreateCategoryRequest {
    body: {
        categoryName: string;
        parentCategoryId?: number;
    };
}
export default async function createCategory(req: CreateCategoryRequest): Promise<void> {
    const { categoryName, parentCategoryId } = req.body;
    const connection: Connection = await connect();

    let query: string;
    let values: (string | number)[];

    if (parentCategoryId) {
        query = 'INSERT INTO Category (categoryName, parentCategoryId) VALUES (?, ?)';
        values = [categoryName, parentCategoryId];
    } else {
        query = 'INSERT INTO Category (categoryName) VALUES (?)';
        values = [categoryName];
    }

    try {
        const [result] = await connection.execute<ResultSetHeader>(query, values);
        console.log('Category created successfully:', result);
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    } finally {
        await connection.end();
    }
}


// // createCategory({ body: { categoryName: 'aircondintions' , } });
// createCategory({ body: { categoryName: 'xbox' , parentCategoryId: 2 } });