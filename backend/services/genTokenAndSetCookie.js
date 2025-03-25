import jwt from 'jsonwebtoken'

export const genTokenAndSetCookie=(res,user)=>{
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, { 
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: "lax" 
    });
    
    return token;

}