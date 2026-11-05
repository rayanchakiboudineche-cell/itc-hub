import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { useLang } from "../LanguageContext";

export default function Chat() {
  const { t, te, lang } = useLang();
  const [messages, setMessages] = useState(
    JSON.parse(sessionStorage.getItem("chat") || "[]")
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem("chat", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const question = input;
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setTyping(true);
    try {
      const data = await api("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: question, lang }),
      });
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: t("error_prefix") + " : " + te(err) }]);
    }
    setTyping(false);
  }

  return (
    <>
      <h1>{t("chat_title")}</h1>
      {messages.map((m, i) => (
        <div key={i} className={"msg " + (m.role === "user" ? "user" : "bot")}>{m.content}</div>
      ))}
      {typing && <div className="msg bot">...</div>}
      <div ref={bottomRef} />
      <form onSubmit={send}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={t("chat_placeholder")} aria-label="Message" />
        <button className="btn" type="submit">{t("send")}</button>
      </form>
    </>
  );
}