const jwt = require("jsonwebtoken");
const db = require("../knex-config");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db("User").where({ id: decoded.id }).first();

    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user; // Attach user info to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };
