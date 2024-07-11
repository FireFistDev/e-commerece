import * as fs from 'fs'
import * as path from 'path'
import connect from '../../database/connect'
import { Connection } from 'mysql2/promise'

export default async function pushTables(): Promise<void> {
    try {
        const sqlFilePath = path.join(__dirname, '../../database/tables.sql');
        const sql = fs.readFileSync(sqlFilePath).toString();
        const connection: Connection = await connect();
        
        const queries = sql.split(';').map(query => query.trim()).filter(query => query);
        
        for (const query of queries) {
            console.log(query);
            await connection.execute(query);
        }

        await connection.end();
    } catch (error) {
        console.error('Error pushing tables:', error);
    }
}

// pushTables();