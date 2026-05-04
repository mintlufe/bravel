"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { CheckboxOption, SubtleOption, TitleTextOption } from "./steps";
import { quizAssets } from "./assets";

const inter = "font-[family-name:var(--font-inter),sans-serif]";

/** Figma QuizOption label — Tag L */
const quizOptionLabel =
  "text-[16px] font-medium leading-4 tracking-[-0.32px] text-[#22262f]";

/**
 * In-flow height matching the portaled {@link ButtonWrapper} tray (`h-14` +
 * `max(1rem, safe-area)`).
 */
export function QuizStickyFooterSlot() {
  return (
    <div
      aria-hidden
      className="pointer-events-none shrink-0"
      style={{
        height: "calc(3.5rem + max(1rem, env(safe-area-inset-bottom, 0px)))",
      }}
    />
  );
}

export const quizStickyScrollGapBottom = "pb-10";

export const quizStickyBottomScrollMargin = "scroll-mb-5";

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
  className?: string;
};

export function QuizFrame({ children, className = "" }: QuizFrameProps) {
  return (
    <div
      className={`${inter} mx-auto flex min-h-0 w-full max-w-[393px] flex-1 flex-col overflow-x-hidden bg-transparent ${className}`}
    >
      {children}
    </div>
  );
}

/** Figma `VectorBeams` */
export function VectorBeamsBackground() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[-883px] z-0 h-[1634px] w-[758px] -translate-x-1/2"
      aria-hidden
    >
      <svg
        width="758"
        height="1634"
        viewBox="-182 -883 758 1634"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block size-full max-h-none max-w-none"
      >
        <path
          d="M231.96 120.665L576 -671.712V-255.842L257.824 164.44L576 -5.12622V96.3538L257.824 164.44L231.96 120.665Z"
          fill="url(#paint0_radial_121_3115)"
        />
        <path
          d="M231.96 218.165L576 597.785V751H446.682L202.118 238.062L231.96 218.165Z"
          fill="url(#paint1_radial_121_3115)"
        />
        <path
          d="M188.191 238.062L-12.8925 751H-182V647.53L146.412 218.165L188.191 238.062Z"
          fill="url(#paint2_radial_121_3115)"
        />
        <path
          d="M132.485 196.277L-182 213.752V116.252L132.485 164.44L-182 -182.219V-562.272L162.328 120.665L132.485 164.44V196.277Z"
          fill="url(#paint3_radial_121_3115)"
        />
        <path
          d="M186.058 -883H67.5418L176.994 120.665H218.261L186.058 -883Z"
          fill="url(#paint4_radial_121_3115)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_121_3115"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(197 179) rotate(90) scale(603.5 279.959)"
          >
            <stop offset="0.21766" stopColor="white" stopOpacity="0" />
            <stop offset="0.728784" stopColor="white" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_121_3115"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(197 179) rotate(90) scale(603.5 279.959)"
          >
            <stop offset="0.21766" stopColor="white" stopOpacity="0" />
            <stop offset="0.728784" stopColor="white" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_121_3115"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(197 179) rotate(90) scale(603.5 279.959)"
          >
            <stop offset="0.21766" stopColor="white" stopOpacity="0" />
            <stop offset="0.728784" stopColor="white" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient
            id="paint3_radial_121_3115"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(197 179) rotate(90) scale(603.5 279.959)"
          >
            <stop offset="0.21766" stopColor="white" stopOpacity="0" />
            <stop offset="0.728784" stopColor="white" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient
            id="paint4_radial_121_3115"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(197 179) rotate(90) scale(603.5 279.959)"
          >
            <stop offset="0.21766" stopColor="white" stopOpacity="0" />
            <stop offset="0.728784" stopColor="white" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/** Teaser sheet — `#191a1f` */
export function SheetBlackButton({
  children,
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="quiz-transition-interactive flex h-14 w-full items-center justify-center rounded-2xl bg-[#191a1f] px-8 py-3 text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-white hover:bg-[#25262e] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

/** Figma `Button` on general funnel — `gray/12` `#22262f`, h 56, radius 16 */
export function FunnelContinueButton({
  children,
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="quiz-transition-interactive flex h-14 w-full items-center justify-center rounded-2xl bg-[#22262f] px-8 py-3 text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-white hover:bg-[#2d3038] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export type SocialProofProps = {
  usersTitle?: string;
  line1?: string;
  line2?: string;
};

export function SocialProof({
  usersTitle = "25k users",
  line1 = "trusted Bravel",
  line2,
}: SocialProofProps) {
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
          <div className="flex max-w-[120px] flex-col gap-1 text-center">
            <p className="text-[20px] font-semibold leading-6 tracking-[-0.6px] text-white">
              {usersTitle}
            </p>
            {line2 ? (
              <div className="text-[14px] font-normal leading-[18px] tracking-[-0.112px] text-[#ebeef5]">
                <p className="mb-0">{line1}</p>
                <p>{line2}</p>
              </div>
            ) : (
              <p className="text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
                {line1}
              </p>
            )}
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

export function Mascot() {
  return (
    <div className="relative size-16 shrink-0 overflow-visible">
      <div className="absolute left-0 top-0 z-0 size-16">
        <div className="absolute inset-[-18.75%]">
          <div className="relative isolate size-full overflow-hidden rounded-full">
            <div className="absolute inset-[8px] rounded-full bg-[radial-gradient(71.87%_71.87%_at_50%_28.12%,#05A8FF_0%,#47BFFF_50%,#70CFFF_100%)]" />
          </div>
        </div>
      </div>
      <div className="mascot-eyes-look absolute left-[21.34px] top-[17.08px] z-10 flex h-[18.115px] w-[27.961px] items-center justify-center will-change-transform">
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
  /**
   * `light` — Figma general funnel bubble (`#cdf0fe`, text `#22262f` / `#464e62`).
   * `dark` — legacy indigo shell (unused after funnel refresh).
   */
  tone?: "dark" | "light";
};

/** Left-pointing tail (mascot side); geometry from legacy export, fill matches bubble. */
function QuizMessageTail({ tone }: { tone: "dark" | "light" }) {
  const fill = tone === "light" ? "#cdf0fe" : "#1a2b3d";
  return (
    <svg
      viewBox="0 0 12 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[42px] w-3 shrink-0"
      aria-hidden
    >
      <path
        d="M12 22L3.68746 28.9271C1.76845 30.5263 1.76844 33.4737 3.68746 35.0729L12 42V32V22Z"
        fill={fill}
      />
    </svg>
  );
}

export function QuizMessage({
  children,
  className = "",
  tone = "light",
}: QuizMessageProps) {
  const bubble =
    tone === "light"
      ? "bg-[#cdf0fe] text-[#22262f]"
      : "bg-[#1a2b3d] text-white";
  return (
    <div
      className={`flex min-w-0 flex-1 shrink-0 items-start self-stretch ${className}`}
    >
      <QuizMessageTail tone={tone} />
      <div
        className={`quiz-transition-interactive flex min-h-[64px] min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-[20px] p-4 ${bubble}`}
      >
        {children}
      </div>
    </div>
  );
}

/** Progress back chevron token (24x24). */
function ChevronBackToken() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="block size-full max-h-none max-w-none"
      aria-hidden
    >
      <path
        d="M15 5L9 12L15 19"
        stroke="#464E62"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ProgressBarProps = {
  current: number;
  total: number;
  onBack: () => void;
  /**
   * `onBlue` — hero / summary on blue (`Image` chevron).
   * `onWhite` — calculating / email white page.
   * `funnel` — Figma ScreenGeneral progress (`#ebeef5` track 8px, dark chevron).
   */
  surface?: "onBlue" | "onWhite" | "funnel";
};

export function ProgressBar({
  current,
  total,
  onBack,
  surface = "onBlue",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  const onWhite = surface === "onWhite";
  const funnel = surface === "funnel";

  return (
    <div className="flex w-full items-center gap-[16px]">
      <div className="flex w-[48px] shrink-0 items-center">
        <button
          type="button"
          onClick={onBack}
          className="quiz-transition-interactive relative size-6 shrink-0 overflow-hidden rounded-sm hover:opacity-80 active:scale-95"
          aria-label="Back"
        >
          <span className="absolute inset-0 flex items-center justify-center">
            <ChevronBackToken />
          </span>
        </button>
      </div>
      <div
        className={`relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-full ${
          funnel || onWhite ? "h-2 bg-[#ebeef5]" : "h-2 bg-[#202227]"
        }`}
      >
        <div
          className="quiz-progress-indicator absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[#05a8ff] to-[#70cfff]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={`flex w-[48px] shrink-0 justify-end whitespace-nowrap text-center text-[16px] leading-4 tracking-[-0.32px] ${
          funnel ? "font-medium" : "font-normal leading-5 tracking-[-0.128px]"
        }`}
      >
        <span
          className={`quiz-transition-interactive tabular-nums ${
            funnel
              ? "text-[#464e62]"
              : onWhite
                ? "text-[#22262f]"
                : "text-[#d5d5d8]"
          }`}
        >
          {current}
        </span>
        <span
          className={
            funnel ? "text-[#7a8399]" : onWhite ? "text-[#7a8399]" : "text-[#8a8d93]"
          }
        >
          /
        </span>
        <span
          className={
            funnel ? "text-[#7a8399]" : onWhite ? "text-[#7a8399]" : "text-[#8a8d93]"
          }
        >
          {total}
        </span>
      </div>
    </div>
  );
}

type TitleTextRowProps = {
  option: TitleTextOption;
  onSelect: () => void;
  /** Figma `109:2250` — multi cards with selection affordance */
  mode?: "single" | "multi";
  selected?: boolean;
};

/** Figma `QuizOptionTitleText` — light card; optional multi-select ring */
export function TitleTextRow({
  option,
  onSelect,
  mode = "single",
  selected = false,
}: TitleTextRowProps) {
  const ring =
    mode === "multi" && selected
      ? "ring-2 ring-[#05a8ff] ring-offset-2 ring-offset-transparent"
      : "";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`quiz-transition-interactive flex w-full items-start gap-3 rounded-2xl border border-[#ebeef5] bg-[#f5f6fa] p-4 text-left hover:bg-[#eef0f5] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff] ${ring}`}
    >
      <div className="flex w-6 shrink-0 flex-col items-center pt-0.5">
        <span className="select-none text-[24px] leading-6 tracking-[-0.192px]">
          {option.emoji}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2 text-[16px] not-italic">
        <p className="w-full text-left font-semibold leading-[18px] tracking-[-0.32px] text-[#22262f]">
          {option.title}
        </p>
        {option.description ? (
          <p className="w-full text-left font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
            {option.description}
          </p>
        ) : null}
      </div>
      {mode === "single" && option.showChevron ? (
        <div className="relative size-5 shrink-0 self-start overflow-hidden pt-0.5">
          <span className="absolute inset-[20.83%_37.5%] block text-[#22262f]">
            <Image
              src={quizAssets.chevronRight}
              alt=""
              width={20}
              height={20}
              className="size-full max-w-none object-contain brightness-0"
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

/** Figma multi `QuizOption` — emoji + label + trailing checkbox */
export function CheckboxRow({ option, selected, onToggle }: CheckboxRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`quiz-transition-interactive flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-[#ebeef5] bg-[#f5f6fa] p-4 text-left hover:bg-[#eef0f5] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff] ${
        selected ? "ring-2 ring-[#05a8ff] ring-offset-1" : ""
      }`}
    >
      {option.emoji ? (
        <span className="shrink-0 text-[24px] leading-6 tracking-[-0.192px]">
          {option.emoji}
        </span>
      ) : null}
      <span className={`min-w-0 flex-1 text-left ${quizOptionLabel}`}>
        {option.label}
      </span>
      <span
        className={`relative size-6 shrink-0 overflow-hidden rounded-lg ${
          selected ? "bg-[#18c362]" : "bg-[#d0d5e1]"
        }`}
        aria-hidden
      >
        {selected ? (
          <Image
            src={quizAssets.checkboxChecked}
            alt=""
            fill
            className="object-cover p-[2px]"
            sizes="24px"
          />
        ) : null}
      </span>
    </button>
  );
}

type SubtleRowProps = {
  option: SubtleOption;
  onSelect: () => void;
  customText?: string;
  onCustomTextChange?: (value: string) => void;
  ensureCustomRowVisible?: () => void;
};

const subtleCardBase =
  "quiz-transition-interactive flex w-full items-center gap-3 rounded-2xl border border-[#ebeef5] bg-[#f5f6fa] p-4 text-left hover:bg-[#eef0f5] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff]";

/** Figma `QuizOptionWithSubtleText` — light sheet */
export function SubtleRow({
  option,
  onSelect,
  customText = "",
  onCustomTextChange,
  ensureCustomRowVisible,
}: SubtleRowProps) {
  const labelCls = option.muted
    ? `${quizOptionLabel} text-[#7a8399]`
    : quizOptionLabel;
  const density = option.density === "spacious" ? "min-h-[80px]" : "min-h-0";

  if (option.allowCustomText) {
    const canSubmit = customText.trim().length > 0;
    return (
      <div
        id="quiz-subtle-custom-row"
        data-quiz-subtle-custom=""
        className={`${subtleCardBase} min-h-14 focus-within:ring-2 focus-within:ring-[#05a8ff] ${quizStickyBottomScrollMargin}`}
      >
        <span className="shrink-0 text-[24px] leading-6 tracking-[-0.192px]">
          {option.emoji}
        </span>
        <input
          type="text"
          value={customText}
          onChange={(e) => onCustomTextChange?.(e.target.value)}
          placeholder={option.label}
          autoComplete="off"
          aria-label={option.label}
          className="min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-[16px] font-medium leading-4 tracking-[-0.32px] text-[#22262f] outline-none placeholder:text-[#7a8399] focus:outline-none focus-visible:ring-0"
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) onSelect();
          }}
          onFocus={() => ensureCustomRowVisible?.()}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${subtleCardBase} ${density}`}
    >
      <span className="shrink-0 text-[24px] leading-6 tracking-[-0.192px]">
        {option.emoji}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className={labelCls}>{option.label}</span>
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
            <span className="text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#7a8399]">
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

/** Figma `QuizOption` (plain label) */
export function PlainRow({ option, onSelect }: PlainRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="quiz-transition-interactive flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-[#ebeef5] bg-[#f5f6fa] p-4 text-left hover:bg-[#eef0f5] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05a8ff]"
    >
      <span className={`min-w-0 flex-1 ${quizOptionLabel}`}>{option.label}</span>
    </button>
  );
}

export function ButtonWrapper({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setContainer(document.body);
  }, []);

  const bar = (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div
        className="pointer-events-auto flex w-full max-w-[393px] flex-col items-stretch bg-[rgba(25,26,31,0.01)] px-4 pt-0 backdrop-blur-[6px]"
        style={{
          paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        }}
        data-node-id="39:1204"
        data-name="ButtonWrapper"
      >
        {children}
      </div>
    </div>
  );

  if (!container) {
    return null;
  }

  return createPortal(bar, container);
}
