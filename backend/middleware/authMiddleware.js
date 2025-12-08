const jwt = require("jsonwebtoken");
const db = require("../knex-config");
const { UnauthorizedError } = require("../utils/customErrors");

const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      req.user = { id: decoded.id, role: decoded.role || "user" };
    } catch (e) {
      // token bad or expired
      return next(new UnauthorizedError("Unauthorized"));
    }

    const user = await db("User").where({ id: decoded.id }).first();
    if (!user) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    req.user = { id: user.id, email: user.email, role: user.role || "user" };
    next();
  } catch (err) {
    next(err); // central error handler -> 500
  }
};

module.exports = { verifyToken };
