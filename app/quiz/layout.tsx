/**
 * Quiz routes sit on base black; step shells (e.g. quiz-shell-gradient) paint on top full-bleed.
 */
export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-black">
      {children}
    </div>
  );
}
