
import mysql, { Connection } from 'mysql2/promise';

export default async function connect(): Promise<Connection> {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost', // Replace with your MySQL server host
            user: 'root', // Replace with your MySQL username
            password: 'root', // Replace with your MySQL password
            database: 'sweeft' // Replace with your database name
        });
        console.log("Connected to the database");
        return connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}
