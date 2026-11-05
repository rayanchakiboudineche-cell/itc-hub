import { Router } from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import { fail, requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: events });
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return fail(res, 404, "NOT_FOUND", "Événement introuvable");
  const event = await Event.findById(req.params.id);
  if (!event) return fail(res, 404, "NOT_FOUND", "Événement introuvable");
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: event });
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, date } = req.body;
  if (!title || !date) return fail(res, 400, "INVALID", "Titre et date obligatoires");
  const event = await Event.create(req.body);
  res.status(201).json({ success: true, data: event });
});

router.post("/:id/register", requireAuth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return fail(res, 404, "NOT_FOUND", "Événement introuvable");

  const count = await Registration.countDocuments({ event: event._id });
  if (count >= event.capacity) return fail(res, 409, "FULL", "Événement complet");

  try {
    await Registration.create({ user: req.user.id, event: event._id });
    res.status(201).json({ success: true, data: { message: "Inscrit" } });
  } catch {
    return fail(res, 409, "ALREADY", "Tu es déjà inscrit");
  }
});

export default router;