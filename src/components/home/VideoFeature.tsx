"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // active = 进入视口后由 IntersectionObserver 自动播放（静音）
  // manualStarted = 用户点击播放按钮（有声，作为后备/主动交互）
  const [active, setActive] = useState(false);
  const [manualStarted, setManualStarted] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // 自动播放（静音 + 循环）：浏览器允许无需用户手势的静音自动播放
  // loop=1 需配合 playlist=<videoId> 才能在单视频上生效
  const autoEmbedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  // 手动点击播放（有声 + 循环）：点击本身是用户手势，允许有声自动播放
  const clickEmbedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  // IntersectionObserver：视频区域进入视口时自动播放
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // 不支持时直接激活，回退到即时加载
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25, rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const showVideo = active || manualStarted;
  const embedSrc = manualStarted ? clickEmbedUrl : autoEmbedUrl;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {showVideo ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <img
              className="absolute top-0 left-0 h-full w-full object-cover"
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes("hqdefault.jpg")) {
                  img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
            />
            {/* 播放按钮：点击播放（有声），作为自动播放的后备 */}
            <button
              type="button"
              onClick={() => setManualStarted(true)}
              aria-label={`Play ${title}`}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.95)] shadow-lg transition-transform hover:scale-105">
                <Play className="ml-1 h-7 w-7 fill-white text-white" />
              </span>
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
