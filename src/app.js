const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const gadgetRoutes = require("./routes/gadgetRoutes");
const authRouter = require("./routes/user");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/gadgets", gadgetRoutes);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("IMF Gadget API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));