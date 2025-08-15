import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getData = (request = NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken.id;
    } catch (error) {
        throw new error (error.message);
    }
}