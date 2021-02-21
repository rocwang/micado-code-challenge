import express from "express";
import compression from "compression";
import cors from "cors";
import pg from "pg";

const { Client } = pg;
const port = 80;

async function query(sql: string): Promise<object[]> {
  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await client.connect();

  const res = await client.query(sql);

  await client.end();

  return res.rows;
}

const app = express();
app.use(cors());
app.use(compression());

app.get("/", async (req, res) => {
  let result: any;

  try {
    result = await query(req.query.sql as string);
  } catch (error: any) {
    res.statusCode = 500;
    result = error.toString();
  }

  res.json(result);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
