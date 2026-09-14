export function PulseMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="20" height="20" rx="5" fill="#151517" stroke="#2D2D30" />
      <path d="M5 11h3l1.55-3.5 2.8 7 1.7-3.5H17" stroke="#EDEDEC" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
