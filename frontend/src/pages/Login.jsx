import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import { useLang } from "../LanguageContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { setUser } = useAuth();
  const { t, te } = useLang();
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (!form.email) e.email = t("email_required");
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t("email_invalid");
    if (form.password.length < 6) e.password = t("password_min");
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      const user = await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      setUser(user);
      navigate("/events");
    } catch (err) {
      setErrors({ global: te(err) });
    }
  }

  return (
    <form onSubmit={submit}>
      <h1>{t("login_title")}</h1>
      <label htmlFor="email">{t("email")}</label>
      <input id="email" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <span className="error">{errors.email}</span>

      <label htmlFor="password">{t("password")}</label>
      <input id="password" type="password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <span className="error">{errors.password}</span>

      <p className="error">{errors.global}</p>
      <button className="btn" type="submit">{t("login_btn")}</button>
    </form>
  );
}