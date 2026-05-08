import userModel from "../models/user.model.js"

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message:'user not found'
            })
        }
        return res.status(200).json({
            message:'user found',
            user
        })
    } catch (error) {
        return res.status(500).json({
            message:`failed to get user ${error}`
        })
    }
}
export {getCurrentUser}