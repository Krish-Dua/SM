import jwt from 'jsonwebtoken'

export const authenticateUser=(req,res,next)=>{
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ success:false,message: "Unauthorized: No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ success:false,message: "Unauthorized: Invalid token" });
    }
}