/**
 * Quiz routes use the same blue base as funnel hero screens.
 */
export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-gradient-to-b from-[#05a8ff] to-[#057ccc]">
      {children}
    </div>
  );
}
