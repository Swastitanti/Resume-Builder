import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
// dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => 
  res.send("server is live...")
);

await connectDB()

app.use("/api/users",userRouter);
app.use("/api/resumes",resumeRouter);
app.use("/api/ai",aiRouter);

app.listen(PORT, () => {
  console.log(`server is running on this PORT : ${PORT}`);
//   connectDB();
});