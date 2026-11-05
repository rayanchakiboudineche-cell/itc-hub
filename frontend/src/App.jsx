import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useLang } from "./LanguageContext";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import AdminEvent from "./pages/AdminEvent";

export default function App() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLang();

  return (
    <>
      <nav>
        <Link to="/">ITC Hub</Link>
        <Link to="/events">{t("nav_events")}</Link>
        {user && <Link to="/chat">{t("nav_chat")}</Link>}
        {user?.role === "admin" && <Link to="/admin/events">{t("nav_admin")}</Link>}
        {user ? (
          <>
            <span>👤 {user.name}</span>
            <button onClick={logout}>{t("nav_logout")}</button>
          </>
        ) : (
          <>
            <Link to="/login">{t("nav_login")}</Link>
            <Link to="/register">{t("nav_register")}</Link>
          </>
        )}
        <select
          className="lang"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label="Language"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={user ? <Chat /> : <Login />} />
          <Route
            path="/admin/events"
            element={user?.role === "admin" ? <AdminEvent /> : <Home />}
          />
        </Routes>
      </main>
    </>
  );
}