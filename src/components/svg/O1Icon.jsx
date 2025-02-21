import React from "react";

export default function NumberIcon() {
  return (
    <svg
      width="1.5rem"
      height="1.5rem"
      fill="currentColor"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 70.87 70.87"
    >
      <defs>
        <style>
          {`
            .cls-1, .cls-2 {
              fill: currentColor;
              stroke: currentColor;
              font-family: MyriadPro-Regular, 'Myriad Pro';
              stroke-miterlimit: 10;
            }
            .cls-1 {
              font-size: 49.39px;
              stroke-width: 1.5px;
            }
            .cls-2 {
              font-size: 51.54px;
            }
          `}
        </style>
      </defs>
      <text className="cls-1" transform="translate(35.35 52.85)">
        <tspan x="0" y="0">
          1
        </tspan>
      </text>
      <text className="cls-2" transform="translate(12.49 52.85)">
        <tspan x="0" y="0">
          o
        </tspan>
      </text>
    </svg>
  );
}
