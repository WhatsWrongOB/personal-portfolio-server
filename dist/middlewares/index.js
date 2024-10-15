import jwt from "jsonwebtoken";
const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unaurhorized access");
    }
    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (error) {
        next(error);
    }
};
export default isAuthenticated;
