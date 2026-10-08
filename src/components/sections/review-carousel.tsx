"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { getReviewPosition } from "@/lib/review-navigation";

/** Only navigation hydrates. Quotes, avatars and brand assets render on the server. */
export function ReviewCarousel({ children, count }: Readonly<{ children: ReactNode; count: number }>) {
  const track = useRef<HTMLOListElement>(null);
  const frame = useRef<number | null>(null);
  const [position, setPosition] = useState({ index: 0, visible: 1 });

  const measure = useCallback(() => {
    const list = track.current;
    const card = list?.firstElementChild as HTMLElement | null;
    if (!list || !card) return;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const step = card.offsetWidth + gap;
    const visible = Math.max(1, Math.round((list.clientWidth + gap) / step));
    const index = getReviewPosition(list.scrollLeft / step, count, visible);
    setPosition((previous) => previous.index === index && previous.visible === visible ? previous : { index, visible });
  }, [count]);

  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => {
      observer.disconnect();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  function moveTo(index: number) {
    const list = track.current;
    if (!list) return;
    const target = getReviewPosition(index, count, position.visible);
    const card = list.children[target] as HTMLElement | undefined;
    if (card) list.scrollTo({ left: card.offsetLeft - (list.firstElementChild as HTMLElement).offsetLeft });
  }

  function onScroll() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(measure);
  }

  function onKeyDown(event: KeyboardEvent<HTMLOListElement>) {
    if (event.target !== event.currentTarget) return;
    const targets: Record<string, number> = {
      ArrowLeft: position.index - 1, ArrowRight: position.index + 1, Home: 0, End: count,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    moveTo(targets[event.key]);
  }

  return (
    <div className="wk-carousel" role="region" aria-roledescription="carousel" aria-label="Client reviews">
      <ol id="workana-reviews" className="wk-reviews" role="list" ref={track} tabIndex={0}
        aria-label="Client reviews. Swipe or use the left and right arrow keys."
        onScroll={onScroll} onKeyDown={onKeyDown}>
        {children}
      </ol>
      <div className="wk-carousel__controls">
        {/* Announced to screen readers only: the arrows carry it on screen */}
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          Reviews {position.index + 1}{position.visible > 1 ? ` to ${Math.min(count, position.index + position.visible)}` : ""} of {count}
        </p>
        <div className="wk-carousel__arrows">
          <button type="button" aria-label="Previous reviews" aria-controls="workana-reviews"
            disabled={position.index === 0} onClick={() => moveTo(position.index - 1)}><ArrowIcon direction="left" /></button>
          <button type="button" aria-label="Next reviews" aria-controls="workana-reviews"
            disabled={position.index >= count - position.visible} onClick={() => moveTo(position.index + 1)}><ArrowIcon /></button>
        </div>
      </div>
    </div>
  );
}
