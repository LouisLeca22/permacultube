import mongoose from 'mongoose'
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createError } from '../errors.js';

export const  signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
    
        const user = await newUser.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        const {password, ...others} = user._doc
        res.cookie("access_token", token, {httpOnly: true}).status(200).json(others)
        res.status(200).send("Votre compte est prêt!")
    } catch (error) {
            next(createError(400, "Impossible de créer un compte"))
        
    }
}


export const  signin = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) return next(createError(404, "Email ou mot de passe invalide"))
        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        console.log(isCorrect)
        if(!isCorrect) return next(createError(404, "Email ou mot de passe invalide"))
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        const {password, ...others} = user._doc
        res.cookie("access_token", token, {httpOnly: true}).status(200).json(others)
    } catch (error) {
            next(createError(500, "Impossible de se connecter"))
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json("déconnecté")
    } catch (error) {
        next(createError(500, "Impossible de se déconnecter"))
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(user){
            const {password, fromGoogle, ...others} = user._doc
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.cookie("access_token", token, {httpOnly: true}).status(200).json(others)

        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save()
            const {password, fromGoogle, ...others} = savedUser._doc
            const token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET)
            res.cookie("access_token", token, {httpOnly: true}).status(200).json(others)
        }
    } catch (error) {
        next(createError(500, "Impossible de s'authentifier"))
    }
}