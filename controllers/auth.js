import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {

     const saltRounds = 10;
     const salt = bcrypt.genSaltSync(saltRounds);
     const hash = bcrypt.hashSync(req.body.password, salt);

     try{
  
        const newUser = new User ({
            username: req.body.username,
            password: hash,
            email: req.body.email
        });
        await newUser.save();

        res.status(201).send("User has been created.")
     }catch (err) {
      if (err.code === 11000) {
         const errorInput = JSON.stringify(Object.keys(err.keyValue)[0]).replaceAll("\"", "");
         const capitalizeError = errorInput.charAt(0).toUpperCase() + errorInput.slice(1);
         next(createError(400, `${capitalizeError} is used`));
         console.log(err)
      } else {
        next(createError(500, "Something went wrong, please try again..."));
      }}
};

export const login = async (req, res, next) => {

    try{
       const user = await User.findOne({username: req.body.username});
       if (user) {
         if (bcrypt.compareSync(req.body.password, user.password)) {
            const {password, isAdmin, ...otherDetails} = user._doc;

            const token = jwt.sign({id:user._id, isAdmin:user.isAdmin}, process.env.JWT);
            
            res.cookie("access_token", token, {httpOnly: true}).status(200).json( {...otherDetails} );
         } else {
            return next(createError(400, "Wrong password or username"));
         }
       } else {
        return next(createError(404, "User not found"));
       }
    }catch (err) {
       next(createError(500, "Something went wrong, please try again"));
    }
};

