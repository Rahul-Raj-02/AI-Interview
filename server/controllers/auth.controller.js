import genToken from "../config/token.js";
import userModel from "../models/user.model.js";
const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name,
        email,
      });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      http: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      user,
      token,
      message: "user created/found successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Google auth error ${error.message}`,
    });
  }
};

const logOut = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Logout error ${error.message}`,
    });
  }
};

export { googleAuth, logOut };