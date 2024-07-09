import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'No token provided',
            statusCode: 401,
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        next();
    } catch (error) {
        res.status(401).json({
            status: 'Unauthorized',
            message: 'Invalid token',
            statusCode: 401,
        });
    }
};

export default authMiddleware;
