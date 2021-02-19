import express from "express";
import pg from "pg";

const { Client } = pg;

async function query(sql: string): Promise<object[]> {
  const client = new Client({
    database: "micado",
    port: 5432,
    user: "covid_app",
  });
  await client.connect();

  const res = await client.query(sql);

  await client.end();

  return res.rows;
}

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const rows = await query(
    (req.query.sql as string) ?? "select * from covid_19_new_zealand limit 10;"
  );

  res.json(rows);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
