import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        message: "user do not have token",
      });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(400).json({
        message: "user does not have a valid token",
      });
    }
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    res.status(500).json({
      message: "isAuth error",
    });
  }
};
export default isAuth;
