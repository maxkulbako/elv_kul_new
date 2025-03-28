import { IconProps } from "./Icon";

const Telegram = ({ className, color }: IconProps) => {
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
        d="M41.1214 17.4687C41.0363 17.4025 40.9326 17.3584 40.8216 17.3414C40.7106 17.3244 40.5966 17.335 40.4918 17.3721L15.4731 26.183C15.2181 26.2721 15.0021 26.4334 14.8578 26.6426C14.7135 26.8517 14.6486 27.0974 14.673 27.3427C14.6974 27.5879 14.8097 27.8193 14.9929 28.0021C15.1762 28.1849 15.4206 28.3091 15.6891 28.3561L22.5703 29.5714V36.4416C22.5703 36.7074 22.6585 36.9671 22.8237 37.1874C22.9889 37.4078 23.2236 37.5786 23.4975 37.6781C23.6737 37.7417 23.8618 37.7745 24.0518 37.7747C24.2505 37.7743 24.4472 37.7379 24.63 37.6677C24.8128 37.5974 24.9781 37.4948 25.1159 37.3659L28.5726 34.1441L33.881 38.3335C34.1501 38.5471 34.4962 38.6656 34.855 38.6668C35.0117 38.6663 35.1674 38.6442 35.3167 38.6013C35.5611 38.5317 35.7809 38.4056 35.9542 38.2356C36.1276 38.0656 36.2483 37.8576 36.3043 37.6325L41.3189 18.0131C41.3441 17.9148 41.3389 17.8121 41.3041 17.7162C41.2693 17.6203 41.2062 17.5348 41.1214 17.4687ZM15.657 27.2629C15.6498 27.2091 15.6632 27.1548 15.6952 27.1089C15.7271 27.063 15.7755 27.0283 15.8323 27.0107L37.3932 19.4173L22.9493 28.7327L15.8805 27.484C15.8206 27.4761 15.7656 27.4497 15.7248 27.4094C15.6841 27.3691 15.6601 27.3173 15.657 27.2629ZM24.4061 36.7482C24.3378 36.8115 24.2501 36.8551 24.1543 36.8734C24.0584 36.8917 23.9586 36.8839 23.8677 36.851C23.7767 36.8182 23.6987 36.7617 23.6435 36.6887C23.5884 36.6158 23.5586 36.5298 23.5579 36.4416V30.1869L27.8269 33.5531L24.4061 36.7482ZM35.3414 37.4303C35.3223 37.5058 35.2817 37.5754 35.2235 37.6324C35.1653 37.6893 35.0916 37.7316 35.0096 37.7551C34.9277 37.7786 34.8404 37.7824 34.7563 37.7661C34.6723 37.7499 34.5944 37.7142 34.5303 37.6625L23.8579 29.2404L40.1165 18.7552L35.3414 37.4303Z"
        fill={color}
      />
    </svg>
  );
};

export default Telegram;
