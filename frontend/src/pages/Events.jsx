import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    setError("");
    api("/api/events")
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return (
    <div>
      <p className="error">{error}</p>
      <button className="btn" onClick={load}>Réessayer</button>
    </div>
  );
  if (events.length === 0) return <p>Aucun événement pour le moment.</p>;

  return ( <><h1>Événements</h1>
      {events.map((ev) => (
        <div className="card" key={ev._id}>
          <h2>{ev.title}</h2>
          <p>{new Date(ev.date).toLocaleDateString()} · {ev.location}</p>
          <Link to={`/events/${ev._id}`}>Voir les détails</Link>
        </div>
      ))}
    </>
  );
}