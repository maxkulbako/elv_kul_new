"use client";

const PageLoader = () => {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center
                    bg-background/70 backdrop-blur-sm"
    >
      {/* spinner */}
      <div
        className="h-16 w-16 rounded-full border-[6px]
                   border-olive-light border-t-olive-primary"
        style={{ animation: "oliveSpin 0.9s linear infinite" }}
      />
    </div>
  );
};

export default PageLoader;
