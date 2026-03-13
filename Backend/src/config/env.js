import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri:
    process.env.MONGODB_URI ??
    "mongodb+srv://username:Password@assessment.nk5ylyr.mongodb.net/",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
