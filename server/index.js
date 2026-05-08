import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import connectDB from './config/db.connect.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import interviewRouter from './routes/interview.route.js'
import paymentRouter from './routes/payment.route.js'

const app = express()
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/interview', interviewRouter)
app.use('/api/payment', paymentRouter)

const PORT = process.env.PORT || 8000
const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`)
        })
        await connectDB()
    } catch (error){
        console.log('could not connect to server')
    }
}
start()