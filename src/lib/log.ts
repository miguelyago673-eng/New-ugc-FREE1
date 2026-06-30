export async function logEvent(
  event: string,
  data?: Record<string, string>
): Promise<void> {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fields = data
    ? Object.entries(data).map(([name, value]) => ({ name, value, inline: true }))
    : [];

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: `\u{1F4CB} ${event}`,
          color: 0x5865f2,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "BestUGCs Logs" },
        }],
      }),
    });
  } catch {
    // silently fail
  }
}
