import mongoose from "mongoose"
const {Schema} = mongoose
const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    planId: String,
    amount: Number,
    credits: Number,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created",
    }
}, {timestamps: true})

const paymentModel = mongoose.model("payment", paymentSchema)

export default paymentModel