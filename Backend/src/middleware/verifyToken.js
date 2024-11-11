const jwt =  require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: "No Token Provided." });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded.userId){
            return res.status(401).send({ message: "User ID not found." });
        }
        req.userId = decoded.userId;
        req.role  = decoded.role;
        next();

    } catch (error) {
        console.error("Error Verifying the Token.",error);
        res.status(401).send({ message: "Invalid Token" });
    }
}

module.exports = verifyToken