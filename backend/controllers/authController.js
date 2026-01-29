import bcrypt from "bcrypt";
import { UsersModel } from "../models/usersModel.js";
import { Auth } from "../core/auth.js";

export const login = async (req, res) => {
  try {
    const { fullName, password } = req.body;

    if (!fullName || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await UsersModel.findOne({ fullName });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Generate token
    const token = Auth.sign({ _id: user.id, fullName: user.fullName });

    // Set token as HttpOnly cookie
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax;`);

    // Respond success (optional, no token in JSON)
    res.status(200).json({ message: "Logged in successfully" });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getMe = async (req, res) => {
  res.json(req.user)
}

export const logout  = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Redirect user to homepage
  return res.status(200).json({ message: "Logged out" });
}