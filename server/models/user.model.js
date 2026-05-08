import mongoose from 'mongoose'
const {Schema} = mongoose
const userSchema = new Schema({
    name:{ 
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    credits:{
        type:Number,
        default:100
    }
}, {timestamps:true})

const userModel = new mongoose.model('user', userSchema)
export default userModel