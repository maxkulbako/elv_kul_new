"use client";

const LoaderUI = ({ text }: { text?: string }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      {/* spinner */}
      <div
        className="h-16 w-16 rounded-full border-[6px]
                   border-olive-light border-t-olive-primary"
        style={{ animation: "oliveSpin 0.9s linear infinite" }}
      />

      {text && (
        <p className="mt-4 text-lg font-semibold text-olive-primary">{text}</p>
      )}
    </div>
  );
};

export default LoaderUI;
