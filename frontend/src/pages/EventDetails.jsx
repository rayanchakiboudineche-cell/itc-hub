import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import { useLang } from "../LanguageContext";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, te } = useLang();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/api/events/${id}`).then(setEvent).catch((e) => setMessage(te(e)));
  }, [id]);

  async function register() {
    try {
      await api(`/api/events/${id}/register`, { method: "POST" });
      setMessage(t("register_ok"));
    } catch (e) {
      setMessage(te(e));
    }
  }

  if (!event) return <p>{message || t("loading")}</p>;

  return (
    <>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>📍 {event.location} · 🏷️ {event.department} · 👥 {event.capacity} {t("seats")}</p>
      {user ? (
        <button className="btn" onClick={register}>{t("register_btn")}</button>
      ) : (
        <p>{t("login_to_register")}</p>
      )}
      <p>{message}</p>
    </>
  );
}