import { IconProps } from "./Icon";

const Viber = ({ className, color }: IconProps) => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.333333"
        y="0.333333"
        width="55.3333"
        height="55.3333"
        rx="27.6667"
        stroke={color}
        strokeWidth="0.666667"
      />
      <path
        d="M35.5 16H20.5C18.0147 16 16 18.0147 16 20.5V35.5C16 37.9853 18.0147 40 20.5 40H35.5C37.9853 40 40 37.9853 40 35.5V20.5C40 18.0147 37.9853 16 35.5 16Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M28 20C31.866 20 35 23.134 35 27C35 30.866 31.866 34 28 34C27.0807 34 26.2004 33.8361 25.3857 33.5355L22 35L23.4645 31.6143C23.1639 30.7996 23 29.9193 23 29C23 25.134 26.134 22 30 22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M28 23V23.01M31 25C31 25 31.5 25.5 31.5 27C31.5 28.5 31 29 31 29"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Viber;
