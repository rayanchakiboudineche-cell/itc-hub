import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { fail, requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return fail(res, 400, "INVALID", "Nom, email et mot de passe (6+) obligatoires");
  if (await User.findOne({ email }))
    return fail(res, 409, "EMAIL_EXISTS", "Cet email existe déjà");

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash });
  res.status(201).json({ success: true, data: { message: "Compte créé" } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash)))
    return fail(res, 401, "BAD_LOGIN", "Email ou mot de passe incorrect");

  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 2 * 60 * 60 * 1000 });
  res.json({ success: true, data: { name: user.name, role: user.role } });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, data: { name: req.user.name, role: req.user.role } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, data: { message: "Déconnecté" } });
});

export default router;