import User from '../models/user.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import jwt from 'jsonwebtoken'; // get signed token
import expressJWT from 'express-jwt'; // for authorisation
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const signup = (req, res)=>{
    const user = new User(req.body);
    user.save((error, user)=>{
        if(error){
            return res.status(400).json({error: errorHandler(error)});
        }
        user.salt = undefined;
        user.hashed_password= undefined;
        res.json({user});
    })
};

const signin = (req, res)=>{
    const{email, password} = req.body; //destructuring from user

    User.findOne({email}, (error, user)=>{
        if(error || !user){
            return res.json({error: 'User with that email not found, please signup'});
        }
        //if user found, make sure email and password match
        //create authenticate method in model
        if(!user.authenticate(password)){
            return res.status(401).send({error: 'email and password does not match'});
        }
        //generate a signed token with user id  and secret  
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        //persist the token as 't' in cookie and expiry date
        res.cookie('t', token, {expire: new Date() + 9999}); 
        //return response with user and token to frontend client
        const {_id, email, name, role} = user;
        return res.json({token, user: {_id, email, name, role}});
    })
}

const signout = (req, res)=>{
    res.clearCookie('t');
    res.json({message: 'Signout successful'});
}


const requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth"
  });

const isAuth = (req, res, next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({error: 'Access denied!'});
    }
    next();
}

const isAdmin = (req, res, next)=>{
    if(req.profile.role===0){
        return res.status(403).json({error: 'Admin resource, access denied!'});
    }
    next();
}

export default {signup, signin, signout, requireSignin, isAdmin, isAuth};