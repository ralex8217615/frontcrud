import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool.connect()
  .then(() => console.log("CONEXIÓN EXITOSA A POSTGRES"))
  .catch(err => console.error("ERROR DE CONEXIÓN:", err.message));