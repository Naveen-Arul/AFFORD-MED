import { useState } from "react";
import { sendLog } from "../services/log";

function NotificationForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !message.trim()) {
      sendLog("frontend", "warn", "form", "Empty title or message submitted");
      return;
    }

    await onAdd({ title: title.trim(), message: message.trim() });
    setTitle("");
    setMessage("");
  };

  return (
    <form className="notification-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter notification title"
        />
      </div>

      <div className="field-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notification message"
          rows="4"
        />
      </div>

      <button type="submit">Add Notification</button>
    </form>
  );
}

export default NotificationForm;
