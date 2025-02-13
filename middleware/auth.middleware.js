import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ error: 'Unauthorized User' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}

export default authUser;