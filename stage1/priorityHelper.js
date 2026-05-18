function typeWeight(type) {
  const map = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };
  return map[type] || 0;
}

function priorityScore(notification) {
  const weight = typeWeight(notification.Type || notification.type || "");
  const ts = Date.parse(notification.Timestamp || notification.timestamp || notification.Time || "") || 0;
  // Combine weight (dominant) and recency. Multiply weight by a large constant so type outranks recency.
  return weight * 1e13 + ts;
}

module.exports = { typeWeight, priorityScore };
