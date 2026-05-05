type QuizAnswer = {
  question?: string;
  answer?: string | string[];
};

type QuizSubmitBody = {
  email?: string;
  answers?: Record<string, QuizAnswer>;
  emailPermission?: boolean | null;
};

const answerOrder = [
  "gender",
  "ageGroup",
  "expressionStruggleFrequency",
  "leftOutFrequency",
  "speakingBlockers",
  "workField",
  "practiceTime",
  "desiredEnglishFeeling",
  "aiTutorPreference",
] as const;

function formatAnswerValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not answered";
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "Not answered";
}

function formatAnswers(answers?: Record<string, QuizAnswer>) {
  if (!answers) return "No answers provided";

  return answerOrder
    .map((key, index) => {
      const item = answers[key];

      const question = item?.question || key;
      const answer = formatAnswerValue(item?.answer);

      return `${index + 1}. ${question}\n${answer}`;
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuizSubmitBody;
    const { email, answers, emailPermission } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return Response.json(
        { success: false, error: "Missing Telegram configuration" },
        { status: 500 },
      );
    }

    const permissionText =
      typeof emailPermission === "boolean"
        ? emailPermission
          ? "Yes"
          : "No"
        : "Not answered";

    const message = [
      "New quiz submission 🎉",
      "",
      `Email: ${email ?? "N/A"}`,
      `Permission to receive emails: ${permissionText}`,
      "",
      "Answers:",
      "",
      formatAnswers(answers),
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
