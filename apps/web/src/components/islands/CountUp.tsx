import { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function CountUp({
  end,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals,
  className = '',
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  // Auto-detect decimals
  const decimalPlaces = decimals ?? (end % 1 !== 0 ? (end.toString().split('.')[1]?.length || 0) : 0);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const durationMs = duration * 1000;
    const delayMs = delay * 1000;
    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      setValue(easeOutExpo(progress) * end);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [end, duration, delay]);

  const formatted = decimalPlaces > 0
    ? value.toFixed(decimalPlaces)
    : Math.floor(value).toLocaleString();

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
