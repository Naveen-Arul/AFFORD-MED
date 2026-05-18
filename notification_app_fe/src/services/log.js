import axios from "axios";

const LOG_ENDPOINT = "http://4.224.186.213/evaluation-service/logs";

export async function sendLog(stack, level, packageName, message) {
  try {
    await axios.post(
      LOG_ENDPOINT,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_EVAL_TOKEN}`,
        },
        timeout: 10000,
      }
    );
  } catch (_err) {
    // Do not block application flow if logging fails.
  }
}
