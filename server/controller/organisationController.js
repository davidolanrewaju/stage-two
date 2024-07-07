import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res
      .status(422)
      .json({ errors: [{ field: "name", message: "Name is required" }] });
  }

  try {
    const organisation = await prisma.organisation.create({
      data: {
        name,
        description,
        users: {
          create: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: organisation.id,
        name: organisation.name,
        description: organisation.description,
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

export const getAllOrganisation = async (req, res) => {
  try {
    const organisations = await prisma.organisation.findMany({
      where: {
        users: {
          some: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: {
        organisations,
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

export const getOranisationById = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organisation = await prisma.organisation.findUnique({
      where: { id: orgId },
      include: { users: true },
    });

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    const userIsMember = organisation.users.some(
      (user) => user.userId === req.user.id
    );
    if (!userIsMember) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not have access to this organisation",
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

export const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organisation = await prisma.organisation.findUnique({
      where: { id: orgId },
    });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!organisation || !user) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation or User not found",
        statusCode: 404,
      });
    }

    await prisma.userOrganisation.create({
      data: {
        userId: user.id,
        orgId: organisation.id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};
