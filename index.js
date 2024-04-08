const express = require("express");
const mysql = require("mysql2/promise");
const { Connector } = require("@google-cloud/cloud-sql-connector");
const e = require("express");

const app = express();
app.set("trust proxy", true);
const port = 3000; // You can change this port number to your desired port

// Database configuration
const dbConfig = {
  instanceConnectionName: "#", // Fill this with your Cloud SQL instance connection name
  ipType: "PUBLIC",
  user: "root",
  password: "#", // Fill this with your database password
  database: "#", // Fill this with your database name
};

// Function to retrieve data from the database
async function getDataFromDB() {
  const connector = new Connector();
  const clientOpts = await connector.getOptions(dbConfig);
  const pool = await mysql.createPool(clientOpts);
  const conn = await pool.getConnection();
  const [result] = await conn.query(`SELECT * FROM data;`);
  await pool.end();
  connector.close();
  return result;
}

// Define API routes
app.get("/api/data", async (req, res) => {
  try {
    const data = await getDataFromDB();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
