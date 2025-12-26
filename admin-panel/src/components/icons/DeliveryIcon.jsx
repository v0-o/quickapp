export default function DeliveryIcon({ className = "w-6 h-6", active = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 3H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
      />
      <circle
        cx="9"
        cy="20"
        r="1"
        stroke="currentColor"
        strokeWidth="2"
        fill={active ? "currentColor" : "none"}
      />
      <circle
        cx="20"
        cy="20"
        r="1"
        stroke="currentColor"
        strokeWidth="2"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}

