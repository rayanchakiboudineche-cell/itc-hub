import { Router } from "express";
import Event from "../models/Event.js";
import Message from "../models/Message.js";
import { fail, requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { message, lang } = req.body;
const langName = { fr: "français", en: "English", ar: "العربية (Arabic)" }[lang] || "français";
  if (!message || message.length > 1000)
    return fail(res, 400, "INVALID", "Message vide ou trop long (max 1000)");

  const events = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(10);

  const systemPrompt = `Tu es "ITC Assistant", l'assistant du club IT Community (Université Saad Dahleb Blida).
- Réponds seulement aux questions sur le club.
- - Réponds toujours en ${langName}.
- Utilise UNIQUEMENT le contexte ci-dessous. Si tu ne sais pas, dis-le.
<context>${JSON.stringify(events)}</context>`;

  const history = await Message.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
  history.reverse();

  await Message.create({ user: req.user.id, role: "user", content: message });

  try {
    const r = await fetch(process.env.OLLAMA_URL + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.2" ,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
        ],
      }),
    });
    const data = await r.json();
    const answer = data.message.content;
    await Message.create({ user: req.user.id, role: "assistant", content: answer });
    res.json({ success: true, data: { answer } });
  } catch (err) {
    console.error("erreur IA : ",err);
    return fail(res, 500, "AI_DOWN", "L'assistant est indisponible pour le moment");
  }
});

router.get("/history", requireAuth, async (req, res) => {
  const messages = await Message.find({ user: req.user.id }).sort({ createdAt: 1 }).limit(50);
  res.set("Cache-Control", "private, no-store");
  res.json({ success: true, data: messages });
});

export default router;