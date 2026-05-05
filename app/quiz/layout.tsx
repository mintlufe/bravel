/**
 * Quiz routes use the same blue base as funnel hero screens.
 */
export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh min-h-0 max-h-dvh w-full max-w-[100vw] touch-pan-y flex-col overflow-hidden overscroll-x-none bg-gradient-to-b from-[#05a8ff] to-[#057ccc]">
      {children}
    </div>
  );
}
