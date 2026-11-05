import jwt from "jsonwebtoken";

export function fail(res, status, code, message) {
  return res.status(status).json({ success: false, error: { code, message } });
}

export function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return fail(res, 401, "NO_TOKEN", "Connecte-toi d'abord");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return fail(res, 401, "BAD_TOKEN", "Session expirée");
  }
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") return fail(res, 403, "FORBIDDEN", "Réservé à l'admin");
  next();
}