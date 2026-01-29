import jwt from "jsonwebtoken";

const privateKey = process.env.PRIVATE_KEY;

export class Auth {
  static sign(payload) {
    return jwt.sign(payload, privateKey, {
      expiresIn: "7d",
    });
  }

  static verify(token) {
    try {
      return jwt.verify(token, privateKey);
    } catch {
      return null;
    }
  }

  static authorization(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = Auth.verify(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;

    next();
  }
}
