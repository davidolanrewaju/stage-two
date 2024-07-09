import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserById = async (req, res) => {
  const { id: userId } = req.params;
  const loggedInUserId = req.user.id;

  try {
    if (userId === loggedInUserId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
          statusCode: 404,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      });
    }

    const organisations = await prisma.organisation.findMany({
      where: {
        members: {
          some: {
            userId: loggedInUserId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    let userFound = null;
    for (const org of organisations) {
      const user = org.members.find((member) => member.userId === userId);
      if (user) {
        userFound = await prisma.user.findUnique({ where: { id: userId } });
        break;
      }
    }

    if (!userFound) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }
    
    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: userFound.id,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email,
        phone: userFound.phone,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};
