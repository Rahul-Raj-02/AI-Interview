import mongoose from "mongoose"
const {Schema} =  mongoose

const questionsSchema = new Schema({
    question:String,
    difficulty:String,
    timeLimit:Number,
    answer:String,
    feedback:String,
    score:{
        type:Number,
        default:0
    },
    confidence:{
        type:Number,
        default:0
    },
    communication:{
        type:Number,
        default:0
    },
    correctness:{
        type:Number,
        default:0
    }
})

const interviewSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role:{
        type: String,
        required: true,
    },
    experience:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        enum:["HR", "Technical"],
        required:true
    },
    resumeText:{
        type:String,
    },
    questions:[questionsSchema],
    finalScore:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["Incompleted", "Completed"],
        default:"Incompleted"
    }
},{timestamps: true})

const interviewModel = mongoose.model('interview', interviewSchema)

export default interviewModel