import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useLang } from "../LanguageContext";

export default function AdminEvent() {
  const { t, te } = useLang();
  const [form, setForm] = useState({
    title: "", description: "", date: "", location: "", department: "", capacity: 50,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = t("title_required");
    if (!form.date) e.date = t("date_required");
    if (Number(form.capacity) < 1) e.capacity = t("capacity_min");
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      await api("/api/events", {
        method: "POST",
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
      });
      setMessage(t("event_created"));
      setTimeout(() => navigate("/events"), 800);
    } catch (err) {
      setErrors({ global: te(err) });
    }
  }

  return (
    <form onSubmit={submit}>
      <h1>{t("admin_title")}</h1>

      <label htmlFor="title">{t("title_label")}</label>
      <input id="title" name="title" value={form.title} onChange={change} />
      <span className="error">{errors.title}</span>

      <label htmlFor="description">{t("description")}</label>
      <textarea id="description" name="description" rows="3"
        value={form.description} onChange={change} />

      <label htmlFor="date">{t("date")}</label>
      <input id="date" name="date" type="datetime-local" value={form.date} onChange={change} />
      <span className="error">{errors.date}</span>

      <label htmlFor="location">{t("location")}</label>
      <input id="location" name="location" value={form.location} onChange={change} />

      <label htmlFor="department">{t("department")}</label>
      <input id="department" name="department" value={form.department} onChange={change} />

      <label htmlFor="capacity">{t("capacity")}</label>
      <input id="capacity" name="capacity" type="number" min="1"
        value={form.capacity} onChange={change} />
      <span className="error">{errors.capacity}</span>

      <p className="error">{errors.global}</p>
      <p>{message}</p>
      <button className="btn" type="submit">{t("create_event")}</button>
    </form>
  );
}