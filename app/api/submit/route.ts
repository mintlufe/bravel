type QuizSubmitBody = {
  email?: string;
  answers?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuizSubmitBody;
    const { email, answers } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return Response.json(
        { success: false, error: "Missing Telegram configuration" },
        { status: 500 },
      );
    }

    const message = [
      "New quiz submission",
      `Email: ${email ?? "N/A"}`,
      "",
      "Answers:",
      JSON.stringify(answers ?? null, null, 2),
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );

    if (!telegramResponse.ok) {
      return Response.json(
        { success: false, error: "Failed to send message to Telegram" },
        { status: 502 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}
