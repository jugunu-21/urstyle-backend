import { Response } from "express-serve-static-core";
import { IUser } from "@/contracts/user";
const jwt = require("jsonwebtoken");

// creating token annd savinf in cookie
const sendToken = (id: any, statusCode: number, res: Response) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    // keeping in cookie
    type OptionType = {
        expires?: Date;
        secure?: boolean;
        sameSite?: "none" | "lax" | "strict";
        httpOnly?: boolean;
    };
    let options:OptionType
    if (process.env.NODE_ENV === "PRODUCTION") {
        options = {

            expires: new Date(
                Date.now() + ((Number(process.env.COOKIE_EXPIRE) || 0) * 24 * 60 * 60 * 1000)
            ),

            secure: true,
            sameSite: "none",

            httpOnly: true
        }
    } else {
        options = {

            expires: new Date(
                Date.now() + ((Number(process.env.COOKIE_EXPIRE) || 0) * 24 * 60 * 60 * 1000)
            ),
            secure: true,
            sameSite: "none",
            httpOnly: true
        }
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token
    })
}
module.exports = sendToken
