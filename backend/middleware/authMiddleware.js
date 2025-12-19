const jwt = require("jsonwebtoken");
const db = require("../knex-config");
const { UnauthorizedError } = require("../utils/customErrors");

const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      req.user = { id: decoded.id, role: decoded.role || "user" };
    } catch (e) {
      // token bad or expired
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await db("User").where({ id: decoded.id }).first();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: user.id, email: user.email, role: user.role || "user" };
    next();
  } catch (err) {
    next(err); // central error handler -> 500
  }
};

module.exports = { verifyToken };
