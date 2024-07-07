import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "Welcome!",
        routes: {
            authentication: {
                register: "https://stage-two-brown.vercel.app/auth/register",
                login: "https://stage-two-brown.vercel.app/auth/login"
            },
        }
    });
});

export default router;