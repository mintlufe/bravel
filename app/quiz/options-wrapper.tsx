"use client";

import type { CSSProperties } from "react";
import type { TitleTextOption } from "./steps";
import { Mascot, QuizMessage, TitleTextRow } from "./ui";

/**
 * Figma `39:600` OptionsWrapper — `get_design_context` (Bravel-test-task):
 * `content-stretch flex flex-col gap-40 items-start px-16 py-40 relative rounded-t-32 size-full` + gradient fill.
 */
/** Solid base + gradient; explicit spacer div handles scroll-safe bottom inset (see below). */
const optionsWrapperStyle: CSSProperties = {
  backgroundColor: "rgb(25, 26, 31)",
  backgroundImage:
    "linear-gradient(180deg, rgb(25, 26, 31) 0%, rgb(25, 26, 31) 69.477%, rgb(36, 38, 74) 86.846%, rgb(64, 61, 202) 100%)",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
};

export type OptionsWrapperProps = {
  question: string;
  options: TitleTextOption[];
  onOptionSelect: () => void;
};

export function OptionsWrapper({
  question,
  options,
  onOptionSelect,
}: OptionsWrapperProps) {
  return (
    <div
      className="relative flex w-full min-w-0 grow shrink-0 basis-auto flex-col items-start gap-10 self-stretch rounded-t-[32px] px-4 pt-10"
      style={optionsWrapperStyle}
      data-name="OptionsWrapper"
      data-node-id="39:600"
    >
      <div
        className="relative flex w-full shrink-0 items-start gap-2"
        data-name="Mascot group"
        data-node-id="39:537"
      >
        <Mascot />
        <QuizMessage>
          <p className="w-full text-left text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-white">
            {question}
          </p>
        </QuizMessage>
      </div>

      <div
        className="relative flex w-full shrink-0 flex-col items-start gap-2"
        data-name="Option group"
        data-node-id="39:542"
      >
        {options.map((opt) => (
          <TitleTextRow key={opt.id} option={opt} onSelect={onOptionSelect} />
        ))}
        {/* Fixed inset: flex % height was unreliable; this always reserves space under the last row. */}
        <div
          aria-hidden
          className="shrink-0"
          style={{
            minHeight: "max(3.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}
