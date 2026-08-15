import { useEffect, useRef, useState } from "react";

export function VideoBackground({
  srcs,
  className = "",
  overlayClassName = "bg-gradient-to-b from-black/50 via-black/30 to-background",
}: {
  srcs: string[];
  className?: string;
  overlayClassName?: string;
}) {
  // Two stacked <video> layers ping-pong so the incoming clip is already
  // playing underneath before we crossfade its opacity in — no hard cut.
  const [frontIsA, setFrontIsA] = useState(true);
  const [srcA, setSrcA] = useState(srcs[0]);
  const [srcB, setSrcB] = useState(srcs[1] ?? srcs[0]);
  const nextIndexRef = useRef(2 % srcs.length);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoARef.current?.play().catch(() => {});
    videoBRef.current?.play().catch(() => {});
  }, [srcA, srcB]);

  function advance() {
    if (srcs.length <= 1) return; // single clip just loops itself
    const next = srcs[nextIndexRef.current];
    nextIndexRef.current = (nextIndexRef.current + 1) % srcs.length;
    if (frontIsA) {
      setSrcB(next);
    } else {
      setSrcA(next);
    }
    setFrontIsA((f) => !f);
  }

  return (
    <div aria-hidden className={`absolute inset-0 z-0 overflow-hidden bg-neutral-900 ${className}`}>
      <video
        ref={videoARef}
        src={srcA}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop={srcs.length <= 1}
        onEnded={frontIsA ? advance : undefined}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
          frontIsA ? "opacity-100" : "opacity-0"
        }`}
      />
      <video
        ref={videoBRef}
        src={srcB}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop={srcs.length <= 1}
        onEnded={!frontIsA ? advance : undefined}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
          !frontIsA ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
