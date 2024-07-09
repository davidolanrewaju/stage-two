import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const userRegistration = async (req, res) => {
    const {firstName, lastName, email, password, phone} = req.body;

    try {
        const saltRounds = 15;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
            },
        });

        const organisationName = `${firstName}'s Organisation`
        const organisation = await prisma.organisation.create({
            data: {
                name: organisationName,
                users: {
                    create: {
                        userId: user.id,
                    }
                }
            }
        });

        const token = jwt.sign({userId:user.id}, JWT_SECRET, {expiresIn: '3h', algorithm: 'HS256'});

        res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
              accessToken: token,
              user: {
                  userId: user.id,
                  firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
              }
            }
        });

    } catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400
        });
    }
};

export const userLogin = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
    
        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401,
          });
        }
    
        const token = jwt.sign({userId:user.id}, JWT_SECRET, {expiresIn: '3h', algorithm: 'HS256'});
    
        res.status(200).json({
          status: 'success',
          message: 'Login successful',
          data: {
            accessToken: token,
            user: {
              userId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
            },
          },
        });
      } catch (error) {
        res.status(400).json({
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: 401,
        });
      }
}

