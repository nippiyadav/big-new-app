import mongoose, { models } from "mongoose";
import bcrypt from  'bcrypt';

const UserModel = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }],
  },
  { timestamps: true }
);

UserModel.pre("save", async function(next){
  // Ensures it only hashes when the password is modified
  console.log("Password before hashing:", this.password);
  if(this.isModified('password')){
    console.log("Password before hashing:", this.password);
    this.password = await bcrypt.hash(this.password, 12);
    console.log("Password after hashing:", this.password);
  }
  next();
})

// models.BlogUser is being used because in next.js it reassign itself if we use without it
export const BlogUser = models.BlogUser ||  mongoose.model('BlogUser',UserModel);
