import jwt from "jsonwebtoken"

const authenticateUser = (req,res,next)=>{
    let token  = req.headers['authorization']
    if(!token){
        return res.status(401).json({errors:'token not provided'})
    }
    token = token.split(' ')[1]
    try{
        const tokenData = jwt.verify(token,process.env.JWT_SECRET)
        console.log('authenticateuser',tokenData)
        req.currentUser = {userId:tokenData.userId , role: tokenData.role}
        next()
    }catch(err){
        console.error("Token verification error :" , err.message)
        return res.status(401).json({errors:err.message})
    }
}

export default authenticateUser