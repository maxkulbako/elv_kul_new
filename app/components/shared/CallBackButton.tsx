"use client";

const CallBackButton = () => {
  return (
    <div className="w-[300px] h-[50px] p-[6px] border-[0.5px] border-[#42412d] rounded-[100px]">
      <button
        className="btn-gradient w-full h-full text-[18px] p-[14px] font-semibold flex items-center justify-center"
        onClick={() => console.log("clicked on call back button")}
      >
        Звʼязатися
      </button>
    </div>
  );
};

export default CallBackButton;
