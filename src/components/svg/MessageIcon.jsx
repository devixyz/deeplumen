import React from "react";

export default function MessageIcon() {
  const styles = {
    path: {
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "3.2px",
    },
    circle: {},
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 70.87 70.87"
      width="1.5rem"
      height="1.5rem"
      stroke="currentColor"
    >
      <path
        style={styles.path}
        d="M24.53,58.4l12.35-6.91h12.88c5.39,0,9.77-4.37,9.77-9.77v-17.09c0-5.39-4.37-9.77-9.77-9.77h-28.65c-5.39,0-9.77,4.37-9.77,9.77v17.09c0,5.39,4.37,9.77,9.77,9.77"
        fill="currentColor"
      />
      <g>
        <circle
          style={styles.circle}
          cx="35.43"
          cy="33.71"
          r="2.92"
          fill="currentColor"
        />
        <circle
          style={styles.circle}
          cx="24.14"
          cy="33.71"
          r="2.92"
          fill="currentColor"
        />
        <circle
          style={styles.circle}
          cx="46.73"
          cy="33.71"
          r="2.92"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
