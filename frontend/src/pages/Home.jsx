import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>ITC Hub</h1>
      <p>&gt; Information Technology Community · Université Saad Dahleb Blida</p>
      <p>&gt; Sharing Is Caring_</p>
      <Link className="btn" to="/events">Voir les événements</Link>
    </>
  );
}