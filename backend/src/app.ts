import Express from "express";
import authRoutes from "./routes/auth.route"
import messageRoutes from "./routes/message.route"

const app = Express()
app.use(Express.json())

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

export default app;