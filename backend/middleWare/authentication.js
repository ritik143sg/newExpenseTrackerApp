const jwt = require("jsonwebtoken");

const secretKey = "abc123";

const genTokent = (req) => {
  const token = jwt.sign(
    {
      id: req.id,
      email: req.email,
      username: req.username,
    },
    secretKey,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { genTokent, authenticate };
