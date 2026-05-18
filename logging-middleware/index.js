const axios = require("axios");

async function Log(stack, level, packageName, message, token) {
  const accessToken = token || process.env.ACCESS_TOKEN;
  const payload = {
    stack,
    level,
    package: packageName,
    message,
  };

  if (!accessToken) {
    console.log("[Log] Missing ACCESS_TOKEN", payload);
    return;
  }

  try {
    await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.log("[Log] Logging failed:", error.message || error.toString());
  }
}

module.exports = Log;
