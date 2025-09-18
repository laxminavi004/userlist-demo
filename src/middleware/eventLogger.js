export async function logEvent(
  { stack, level, pkg, message, meta = {} },
  token
) {
  const payload = {
    stack: stack || "frontend",
    level: level || "info",
    package: pkg || "frontend",
    message: message || "",
    meta,
  };

  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok)
      return { ok: false, status: res.status, body: await res.text() };
    return { ok: true, data: await res.json() };
  } catch (err) {
    // network failure — keep logs locally to retry later (simple fallback)
    const queue = JSON.parse(localStorage.getItem("logQueue") || "[]");
    queue.push({ payload, ts: new Date().toISOString() });
    localStorage.setItem("logQueue", JSON.stringify(queue));
    return { ok: false, error: String(err) };
  }
}
