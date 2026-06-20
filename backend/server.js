const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully 🚀" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Backend running on port 5000");
});