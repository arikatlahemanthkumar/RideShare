import User from '../models/user-model.js'
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { validationResult } from 'express-validator'

const userCtrl = {}

userCtrl.register = async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    const user = new User(body)
    try{
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password,salt)
        user.password = hashPassword
        await user.save()
        res.status(201).json(user)
    }catch(err){
        res.status(500).json({error:'something went wrong '})
    }
}

userCtrl.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: "Invalid email/password" });
        }

        const isValidUser = await bcryptjs.compare(password, user.password);
        if (!isValidUser) {
            return res.status(400).json({ error: "Invalid password" });
        }

        
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );

        res.json({ 
            token: `Bearer ${token}`, 
            user: { _id: user._id, email: user.email, role: user.role, name: user.name }
        });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

userCtrl.account = async(req,res)=>{
    try{
        const user = await User.findById(req.currentUser.userId)
        console.log(user)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        return res.json({user})
    }catch(err){
        res.status(500).json({error:"something went wrong"})
    }
}

userCtrl.list = async(req,res)=>{
    try{
        const search = req.query.search || ''
        const sortBy = req.query.sortBy || 'name'
        const order = req.query.order || 1
        let page = req.query.page || 1
        let limit = req.query.limit || 5
        const searchQuery = {
            $or: [
                { name: { $regex: search, $options: "i" } },  
                { email: { $regex: search, $options: "i" } }, 
                { role: { $regex: search, $options: "i" } }   
            ]
        };
        const sortQuery = {}
        sortQuery[sortBy] = order === 'asc' ? 1: -1
        page = parseInt(page)
        limit = parseInt(limit)
        const users = await User
                            .find(searchQuery)
                            .sort(sortQuery)
                            .skip((page - 1) * limit)
                            .limit(limit)

        const total = await User.countDocuments(searchQuery)
        res.json({
            data :users,
            total,
            page,
            totalPages:Math.ceil(total / limit)
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error:"something went wrong"})
    }
    
}

userCtrl.activation = async(req,res)=>{
    const body = req.body
    const id = req.params.id
    const user = await User.findByIdAndUpdate(id,body,{new:true})
    res.json(user)
}

export default userCtrl