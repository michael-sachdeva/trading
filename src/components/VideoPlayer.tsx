"use client";

import { useRef, useState } from "react";
import { Play, Pause, Maximize } from "lucide-react";

type Props = {
  src?: string | null;
  lessonId: string;
  onComplete?: () => void;
};

/**
 * Minimal secure video player shell.
 *
 * Production notes:
 * - `src` should be a short-lived signed URL (Supabase Storage signed URL,
 *   or a signed HLS manifest from Mux/BunnyStream) generated server-side —
 *   never a public bucket URL — so links can't be shared or hotlinked.
 * - Right-click / download is disabled via controlsList + contextMenu below;
 *   for real DRM-grade protection, pair this with an HLS provider that
 *   supports token-expiring manifests (Mux Signed Playback, Bunny Token
 *   Authentication, or Supabase Storage signed URLs with a short TTL).
 */
export default function VideoPlayer({ src, lessonId, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl2 bg-navy-900 text-white/40">
        Video not yet uploaded for this lesson.
      </div>
    );
  }

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  }

  function changeSpeed(rate: number) {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setSpeed(rate);
  }

  return (
    <div className="overflow-hidden rounded-xl2 bg-black shadow-soft-lg">
      <video
        ref={videoRef}
        src={src}
        className="aspect-video w-full"
        controlsList="nodownload noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
        onEnded={onComplete}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="flex items-center justify-between bg-navy-900 px-4 py-3">
        <button onClick={togglePlay} className="text-white">
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => changeSpeed(rate)}
              className={`rounded px-2 py-1 text-xs font-semibold ${
                speed === rate ? "bg-royal text-white" : "text-white/50"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
        <button
          onClick={() => videoRef.current?.requestFullscreen()}
          className="text-white/70"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
