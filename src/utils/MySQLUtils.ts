import mysql, {Pool, PoolConnection} from "mysql2/promise";

class MySQLUtils {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0,
            connectTimeout: 10000,
        });


        setInterval(async () => {
            try {
                await this.executeQuery('SELECT 1');
            } catch (e: any) {
                console.error(`Error in MySQL connection pool: ${e.message}`);
            }
        }, 1000 * 60 * 5);
    }

    public async getConnection(): Promise<PoolConnection> {
        try {
            return await this.pool.getConnection();
        } catch (e: any) {
            throw new Error(`Error getting connection: ${e.message}`);
        }
    }
    public async executeQuery<T = any>(query: string, values?: any[]): Promise<T> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.getConnection();
            const [result] = await connection.execute(query, values);
            return result as T;
        } catch (e: any) {
            throw new Error(`Query execution failed: ${e.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    public async testConnection(): Promise<boolean> {
        try {
            const conn = await this.pool.getConnection();
            await conn.ping(); // opsiyonel ama faydalı
            conn.release();
            return true;
        } catch (err) {
            return false;
        }
    }

}




const mySQLUtils = new MySQLUtils();
export default mySQLUtils;