export function typeWeight(type) {
  const map = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };
  return map[type] || 0;
}

export function priorityScore(notification) {
  const weight = typeWeight(notification.Type || notification.type || "");
  const timestamp = Date.parse(notification.Timestamp || notification.timestamp || "") || 0;
  return weight * 1e13 + timestamp;
}

export function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => priorityScore(b) - priorityScore(a));
}
