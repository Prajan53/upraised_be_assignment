const express = require("express");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("../config/db");
const rateLimit = require("express-rate-limit");
const authRouter = express.Router();

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { error: "Too many login attempts, try again later." }
  });

authRouter.post("/signup", async (req, res) => {
    try{
    const requiredBody = z.object({
        name: z.string().min(3, "Name is too short").max(14, "Name is too long").regex(/[a-zA-Z]/, "You can enter only alphabets"),
        email: z.string().email().min(15, "Email is too short").max(26, "Email is too long").regex(/[a-zA-Z]/, "You can enter only alphabets"),
        password: z.string().min(6, "Password is too short").max(32, "Password is too long").regex(/[A-Z]/, "Password must contain one upper case character").regex(/[./\<>?+*@;:"^`#()_-]/, "Password must contain atleast one special character").regex(/[0-9]/, "Password must contain at least one number").regex(/[a-zA-Z]/, "You can enter only alphabets")
    });

    const parsedBody = requiredBody.safeParse(req.body);


    if(!parsedBody.success){
        const errorMessages = parsedBody.error.errors.map(err => err.message);
        return res.status(400).json({
            message: errorMessages
        });
    }

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const signUpResponse = await client.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    if(signUpResponse){
        res.status(200).json({
            message: "User created successfully"
        });
    }else{
        res.status(409).json({
            message: "There was an error while signing up"
        });
    }
    }catch(e){
        res.status(500).json({
            error: ("Internal Server Error: ", e.message)
        });
    }
});

authRouter.post("/login", authLimiter, async (req,res) => {
    try{
        const requiredBody = z.object({
            email: z.string().email("This is not an email").regex(/[a-zA-Z]/, "You can enter only alphabets").max(26,"Email is too long"),
            password: z.string().min(6, "Password id is too short").max(32,"Password is too long").regex(/[A-Z]/, "Password must contain one upper case character").regex(/[./\<>?+*@;:"^`#()_-]/, "Password must contain atleast one special character").regex(/[0-9]/, "Password must contain at least one number").regex(/[a-zA-Z]/, "You can enter only alphabets")
        });

        const parsedBody = requiredBody.safeParse(req.body);

        if(!parsedBody.success){
            const errorMessages = parsedBody.error.errors.map(err => err.message);
            return res.status(400).json({
                 message: errorMessages
             });
         }
    const { email, password } = req.body;
    const user = await client.user.findUnique({
        where: {
            email
        }
    });
    if(!user){
       return res.status(404).json({
            message: "User does not exist"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch){
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_USER)
        res.status(200).json({
            message: "Logged in successfully",
            token
        });
    }else{
        res.status(409).json({
            message: "Incorrect credentials"
        });
    }
}catch(e){
    res.status(500).json({
        error: ("Internal Server Error: ", e.message)
    });
}
});

module.exports = authRouter;

