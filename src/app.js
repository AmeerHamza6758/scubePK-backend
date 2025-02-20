const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.config");
const seedAdmin = require("./utils/admin.seeder");
const indexRouter = require("./routes/index");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

app.use("/api", indexRouter);

connectDB()
  .then(async () => {
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MySQL:", err);
    process.exit(1);
  });
