import dotenv from "dotenv"
import { number } from "zod";

dotenv.config();
const env = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    nodeEnv: process.env.NODE_ENV,

    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS)
};
export default env;