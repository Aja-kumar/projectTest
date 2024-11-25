export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.Access_token;
    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided!" });
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware:", error.message);
    return res.status(500).json({ message: "Invalid Access Token" });
  }
};
