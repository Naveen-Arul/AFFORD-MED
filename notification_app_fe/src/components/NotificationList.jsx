function NotificationList({ notifications, onDelete }) {
  if (!notifications.length) {
    return <div className="empty-state">No notifications yet.</div>;
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <div className="notification-card" key={notification.id}>
          <div>
            <h2>{notification.title}</h2>
            <p>{notification.message}</p>
          </div>
          <button
            className="delete-button"
            onClick={() => onDelete(notification.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationList;
