import { createError } from '../errors.js';
import Comment from "../models/Comments.js";
import Video from "../models/Video.js"

export const addComment = async (req, res, next) => {
    const newComment = new Comment({userId: req.user.id, ...req.body})
    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const video = await Video.findById()
        if(req.user.id === comment.userId || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json("Le commentaire a été supprimé")
        } else {
            return next(createError(403, "Vous ne pouvez pas supprimer ce commentaire"))
        }
    } catch (error) {
        next(error)
    }
}

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({videoId: req.params.videoId})
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}