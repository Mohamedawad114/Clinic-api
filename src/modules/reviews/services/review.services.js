import asyncHandler from 'express-async-handler'
import review from '../../../DB/models/reviews.model.js'
import  {reviewValidation}  from '../../../middlwares/validation.middleware.js'




export const addreview=asyncHandler(
    async(req,res)=>{
        const {content,stars}=req.body
        if(!stars)return res.status(400).json({Message:`stars required`})
        const userId=req.user.id
    const { error } = reviewValidation(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });
    const create =await review.create({content,stars,userId})
    if(create)return res.status(201).json({Message:`review added`})
    }
)
export const delete_review=asyncHandler(
    async(req,res)=>{
       const reviewId=req.params.id
       const userId=req.user.id
       if(!reviewId){return res.status(400).send(`reviewId is required`)}
        const Review=await review.findOne({_id:reviewId,userId:userId})
        if(!Review) return res.status(403).json({Message:`you 're not authorizated`})
            const deleted=await review.deleteOne({_id:reviewId,userId})
        if(deleted) return res.status(200).json({Message:`review is deleted`})
    }
)
export const delete_review_admin=asyncHandler(
    async(req,res)=>{
       const reviewId=req.params.id
       if(!reviewId){return res.status(400).send(`reviewId is required`)}
            const deleted=await review.deleteOne({_id:reviewId})
        if(deleted) return res.status(200).json({Message:`review is deleted`})
    }
)
export const allreviews=asyncHandler(
    async(req,res)=>{
        const page_num=req.query.page_num
        const limit=8
        const offset=(page_num-1)*limit
        const reviews=await review.find({},{updatedAt:0,_id:0}).populate({path:"userId",select:`firstName lastName`}).skip(offset).limit(limit)
        if (reviews.length === 0) return res.status(200).json({ message: 'No reviews found' });
        return res.status(200).json({reviews})
    }
)