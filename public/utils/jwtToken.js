"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const sendToken = (id, statusCode, res) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    let options;
    if (process.env.NODE_ENV === "PRODUCTION") {
        options = {
            expires: new Date(Date.now() + ((Number(process.env.COOKIE_EXPIRE) || 0) * 24 * 60 * 60 * 1000)),
            secure: true,
            sameSite: "none",
            httpOnly: true
        };
    }
    else {
        options = {
            expires: new Date(Date.now() + ((Number(process.env.COOKIE_EXPIRE) || 0) * 24 * 60 * 60 * 1000)),
            secure: true,
            sameSite: "none",
            httpOnly: true
        };
    }
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token
    });
};
module.exports = sendToken;
