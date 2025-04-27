import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import complaintRoutes from "./routes/complaintRoutes";
import personnelRoutes from "./routes/personnelRoutes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api', userRoutes);
app.use("/api", complaintRoutes);
app.use("/api/personnel", personnelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
