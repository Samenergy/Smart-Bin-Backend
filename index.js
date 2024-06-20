import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import signupRoutes from "./src/routes/signupRoutes.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import householdRoutes from "./src/routes/householdRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "https://smart-bin-sigma.vercel.app",
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/household", householdRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
