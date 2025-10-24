import express from "express";
import cors from "cors";
import applicationRoutes from "./routes/applicationRoutes";
import approvalRoutes from "./routes/approvalRoutes";
import messageRoutes from "./routes/messageRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/approvals", approvalRoutes);
app.use("/api/v1/messages", messageRoutes);

app.get("/health", (_, res) => res.send("✅ BGF API Running"));

export default app;
