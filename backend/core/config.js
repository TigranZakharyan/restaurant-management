import dotenv from "dotenv";

dotenv.config();

export class Config {
    static MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/retaurant-db";
    static PORT = process.env.PORT || 8000
    static ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin"
    static ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pass"
}

