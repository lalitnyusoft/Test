require('dotenv').config();
const { JWT_SECRET } = process.env;
export class AppConstants {
    static jwtSecret = JWT_SECRET;
}
