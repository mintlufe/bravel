"use client";

import Image from "next/image";
import type { CheckboxOption, SubtleOption, TitleTextOption } from "./steps";
import { quizAssets } from "./assets";

const inter = "font-[family-name:var(--font-inter),sans-serif]";

/** Paragraph/Paragraph M — used on QuizOption & QuizOptionWithSubtleText */
const quizParagraphM =
  "text-[16px] font-normal leading-5 tracking-[-0.128px]";

type PrimaryButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
};

export function PrimaryButton({
  children,
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group relative flex h-12 w-full items-center justify-center rounded-2xl px-8 py-3 text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        aria-hidden
        className="quiz-transition-interactive absolute inset-0 rounded-2xl bg-gradient-to-b from-[#47bfff] to-[#057ccc] opacity-100 group-hover:opacity-0 group-disabled:opacity-100 group-disabled:group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="quiz-transition-interactive absolute inset-0 rounded-2xl bg-gradient-to-b from-[#70cfff] to-[#05a8ff] opacity-0 group-hover:opacity-100 group-disabled:opacity-0 group-disabled:group-hover:opacity-0"
      />
      <span className="relative">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_12px_0px_rgba(255,255,255,0.25)]"
      />
    </button>
  );
}

type QuizFrameProps = {
  children: React.ReactNode;
};

/**
 * 393px column over a full-bleed shell: parent sets base `bg-black` (ScreenStart) or
 * `.quiz-shell-gradient` (ScreenGeneral `39:754` and all other quiz steps).
 */
export function QuizFrame({ children }: QuizFrameProps) {
  return (
    <div
      className={`${inter} mx-auto flex min-h-0 w-full max-w-[393px] flex-1 flex-col overflow-x-hidden bg-transparent text-white`}
    >
      {children}
    </div>
  );
}

export function SocialProof() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-center gap-4">
        <div className="relative h-[72px] w-[35px] shrink-0">
          <Image
            src={quizAssets.oliveLeft}
            alt=""
            fill
            className="object-contain"
            sizes="35px"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="relative size-4 shrink-0 overflow-hidden">
                <Image
                  src={quizAssets.star}
                  alt=""
                  fill
                  className="object-contain p-[8.33%]"
                  sizes="16px"
                />
              </div>
            ))}
          </div>
          <div className="flex w-[104px] flex-col gap-1 text-center">
            <p className="text-[20px] font-semibold leading-6 tracking-[-0.6px] text-white">
              25k users
            </p>
            <p className="text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
              trusted Bravel
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-center">
          <div className="relative h-[72px] w-[35px] -scale-y-100 rotate-180">
            <Image
              src={quizAssets.oliveRight}
              alt=""
              fill
              className="object-contain"
              sizes="35px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SVG mascots use `<img>` (not `next/image`) and assets avoid heavy SVG filters
 * (Safari rasterizes those badly). Soft rim glow is CSS `drop-shadow` on the body only.
 */
export function Mascot() {
  return (
    <div className="relative size-16 shrink-0 overflow-visible">
      <div className="absolute left-0 top-0 size-16">
        <div className="absolute inset-[-18.75%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={quizAssets.mascotBody}
            alt=""
            width={88}
            height={88}
            decoding="sync"
            fetchPriority="high"
            draggable={false}
            className="size-full max-h-none max-w-none object-contain object-center mascot-body-img"
          />
        </div>
      </div>
      <div className="mascot-eyes-look absolute left-[21.34px] top-[17.08px] flex h-[18.115px] w-[27.961px] items-center justify-center will-change-transform">
        <div className="flex-none -rotate-[9.54deg]">
          <div className="mascot-eyes-blink relative h-[14px] w-[26px] will-change-transform">
            <div className="absolute inset-[-71.43%_-46.15%_-100%_-46.15%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={quizAssets.mascotEyes}
                alt=""
                width={50}
                height={38}
                decoding="sync"
                draggable={false}
                className="size-full max-h-none max-w-none object-contain object-center mascot-eyes-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type QuizMessageProps = {
  children: React.ReactNode;
  className?: string;
};

export function QuizMessage({ children, className = "" }: QuizMessageProps) {
  return (
    <div
      className={`flex w-[286px] shrink-0 items-start self-stretch ${className}`}
    >
      <div className="relative h-[42px] w-3 shrink-0">
        <Image
          src={quizAssets.messageTail}
          alt=""
          fill
          className="object-contain"
          sizes="12px"
        />
      </div>
      {/* QuizMessage / Question — min height 64px, radius 20, padding 16 (Figma instance) */}
      <div className="quiz-transition-interactive flex min-h-[64px] min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-[20px] bg-[#1a2b3d] p-4">
        {children}
      </div>
    </div>
  );
}

type ProgressBarProps = {
  current: number;
  total: number;
  onBack: () => void;
};

export function ProgressBar({ current, total, onBack }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex w-12 shrink-0 items-center">
        <button
          type="button"
          onClick={onBack}
          className="quiz-transition-interactive relative size-5 overflow-hidden rounded-sm hover:opacity-80 active:scale-95"
          aria-label="Back"
        >
          <span className="absolute inset-[20.83%_37.5%]">
            <Image
              src={quizAssets.chevronBack}
              alt=""
              width={20}
              height={20}
              className="size-full max-w-none object-contain"
            />
          </span>
        </button>
      </div>
      <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#202227]">
        <div
          className="quiz-progress-indicator absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[#045495] to-[#05a8ff]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex w-12 shrink-0 justify-end whitespace-nowrap text-center text-[16px] font-normal leading-5 tracking-[-0.128px]">
        <span className="quiz-transition-interactive tabular-nums text-[#d5d5d8]">
          {current}
        </span>
        <span className="text-[#8a8d93]">/</span>
        <span className="text-[#8a8d93]">{total}</span>
      </div>
    </div>
  );
}

type TitleTextRowProps = {
  option: TitleTextOption;
  onSelect: () => void;
};

/** Start-option row: emoji aligned with title; chevron stays square — avoid self-stretch + fill (distorts SVG). */
export function TitleTextRow({ option, onSelect }: TitleTextRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="quiz-transition-interactive flex w-full items-start gap-3 rounded-[16px] bg-[#202227] p-4 text-left hover:bg-[#292c32] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff]"
    >
      <div className="flex w-6 shrink-0 flex-col items-center pt-0.5">
        <span className="select-none text-[24px] leading-6 tracking-[-0.192px]">
          {option.emoji}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2 text-[16px] not-italic">
        <p className="w-full text-left font-semibold leading-[18px] tracking-[-0.32px] text-white">
          {option.title}
        </p>
        {option.description ? (
          <p className="w-full text-left font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
            {option.description}
          </p>
        ) : null}
      </div>
      {option.showChevron ? (
        <div className="relative size-5 shrink-0 self-center overflow-hidden">
          <span className="absolute inset-[20.83%_37.5%] block">
            <Image
              src={quizAssets.chevronRight}
              alt=""
              width={20}
              height={20}
              className="size-full max-w-none object-contain"
            />
          </span>
        </div>
      ) : null}
    </button>
  );
}

type CheckboxRowProps = {
  option: CheckboxOption;
  selected: boolean;
  onToggle: () => void;
};

export function CheckboxRow({ option, selected, onToggle }: CheckboxRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group quiz-transition-interactive flex min-h-14 w-full items-center gap-3 rounded-[20px] bg-[#202227] p-4 text-left hover:bg-[#292c32] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff]"
    >
      <span
        className={`quiz-transition-interactive relative size-6 shrink-0 overflow-hidden rounded-lg ${
          selected
            ? "bg-[#353840]"
            : "bg-[#353840] group-hover:bg-[#474a52]"
        }`}
      >
        <span
          className={`absolute inset-0 transition-opacity duration-[var(--quiz-duration,300ms)] [transition-timing-function:var(--quiz-ease,cubic-bezier(0.4,0,0.2,1))] ${
            selected ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={quizAssets.checkboxChecked}
            alt=""
            fill
            className="object-cover"
            sizes="24px"
          />
        </span>
      </span>
      <span className={`min-w-0 flex-1 text-white ${quizParagraphM}`}>
        {option.label}
      </span>
    </button>
  );
}

type SubtleRowProps = {
  option: SubtleOption;
  onSelect: () => void;
  customText?: string;
  onCustomTextChange?: (value: string) => void;
};

/** Figma `QuizOptionWithSubtleText` — label & native use Paragraph M */
export function SubtleRow({
  option,
  onSelect,
  customText = "",
  onCustomTextChange,
}: SubtleRowProps) {
  const primary = option.muted ? "text-[#8a8d93]" : "text-white";
  const emojiCls = option.muted ? "text-[#8a8d93]" : "text-white";

  if (option.allowCustomText) {
    const canSubmit = customText.trim().length > 0;
    return (
      <div className="quiz-transition-interactive flex w-full min-h-14 items-center gap-3 rounded-[20px] bg-[#202227] px-4 py-4 focus-within:shadow-[inset_0_0_0_1px_#05a8ff]">
        <span
          className={`shrink-0 text-[24px] leading-6 tracking-[-0.192px] ${emojiCls}`}
        >
          {option.emoji}
        </span>
        <input
          type="text"
          value={customText}
          onChange={(e) => onCustomTextChange?.(e.target.value)}
          placeholder={option.label}
          autoComplete="off"
          aria-label={option.label}
          className={`min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 ${quizParagraphM} text-white outline-none placeholder:text-[#8a8d93] focus:outline-none focus-visible:ring-0`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) onSelect();
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="quiz-transition-interactive flex w-full items-center gap-3 rounded-[20px] bg-[#202227] p-4 text-left hover:bg-[#292c32] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff]"
    >
      <span
        className={`shrink-0 text-[24px] leading-6 tracking-[-0.192px] ${emojiCls}`}
      >
        {option.emoji}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className={`${quizParagraphM} ${primary}`}>
          {option.label}
        </span>
        {option.native ? (
          <>
            <span className="relative size-1 shrink-0">
              <Image
                src={quizAssets.dot}
                alt=""
                fill
                className="object-contain"
                sizes="4px"
              />
            </span>
            <span className={`${quizParagraphM} text-[#8a8d93]`}>
              {option.native}
            </span>
          </>
        ) : null}
      </span>
    </button>
  );
}

type PlainRowProps = {
  option: CheckboxOption;
  onSelect: () => void;
};

/** Figma `QuizOption` — row label Paragraph M */
export function PlainRow({ option, onSelect }: PlainRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="quiz-transition-interactive flex min-h-14 w-full items-center gap-3 rounded-[20px] bg-[#202227] p-4 text-left hover:bg-[#292c32] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff]"
    >
      <span className={`min-w-0 flex-1 text-white ${quizParagraphM}`}>
        {option.label}
      </span>
    </button>
  );
}

/** Fixed to the bottom of the viewport; use whenever the screen has a primary bottom action (matches Figma ButtonWrapper). */
export function ButtonWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-10 flex justify-center">
      <div className="pointer-events-auto w-full max-w-[393px] bg-[rgba(25,26,31,0.01)] px-4 pt-3 backdrop-blur-[6px] [padding-bottom:max(3.5rem,env(safe-area-inset-bottom,0px))]">
        {children}
      </div>
    </div>
  );
}
