import User from '../models/User.js';
import Video from "../models/Video.js"
import { createError } from '../errors.js';

export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, 'Vous ne pouvez pas mettre à jour ce compte'));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("l'utilisateur a été supprimé");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, 'Vous ne pouvez pas supprimer ce compte'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, fromGoogle, ...others} = user._doc
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });
    res.status(200).json('Abonné !')
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } });
        res.status(200).json('Désabonné !')
      } catch (error) {
        next(error);
      }
};

export const like = async (req, res, next) => {
  const id = req.user.id 
  const videoId = req.params.videoId 
  try {
    await Video.findByIdAndUpdate(videoId, {$addToSet: {likes: id}, $pull: {dislkies: id}})
    res.status(200).json("La vidéo a été likée")
  } catch (error) {
    next(error);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id 
  const videoId = req.params.videoId 
  try {
    await Video.findByIdAndUpdate(videoId, {$addToSet: {dislikes: id}, $pull: {likes: id}})
    res.status(200).json("La vidéo a été dislikée")
  } catch (error) {
    next(error);
  }
};
