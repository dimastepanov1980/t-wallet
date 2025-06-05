export const TransferIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    fill="none"
  >
    <defs>
      <linearGradient
        id="transfer-gradient"
        x1="21"
        y1="15.5"
        x2="6.263"
        y2="15.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0.5" stopColor="currentColor" />
        <stop offset="1" stopOpacity="0.4" stopColor="currentColor" />
      </linearGradient>
    </defs>
    <path
      opacity="0.95"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 5V0l9 8.5-9 8.5v-5H9V7l-4.13 3.9A4.99 4.99 0 0 1 3 7V5h12Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 19v5l-9-8.5L9 7v5h6v5l4.13-3.9A4.99 4.99 0 0 1 21 17v2H9Z"
      fill="url(#transfer-gradient)"
    />
  </svg>
);