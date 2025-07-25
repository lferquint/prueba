import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
// const PORT = 3306

const connection = await mysql.createConnection({
  host: 'srv1135.hstgr.io',
  // port: PORT,
  user: 'u667942166_root',
  database: 'u667942166_vrintex2',
  password: process.env.DB_PASSWORD
})
export default connection
