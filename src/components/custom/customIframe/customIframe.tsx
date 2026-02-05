"use client";

import { useMemo } from "react";

export enum AspectRatioEnum {
  Half = "16/9",
  ThreeQuater = "4/3",
  Full = "1/1",
}

type CustomIframeVideoProps = {
  src: string;
  title?: string;
  aspectRatio?: AspectRatioEnum;
  allowFullScreen?: boolean;
  allowAutoPlay?: boolean;
  className?: string;
};

const ASPECT_RATIO_CLASS = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

const CustomIframe = ({
  src,
  title = "Embedded video",
  aspectRatio = AspectRatioEnum.Half,
  allowFullScreen = true,
  allowAutoPlay = true,
  className = "",
}: CustomIframeVideoProps) => {
  const allow = useMemo(() => {
    const permissions = [
      "accelerometer",
      "clipboard-write",
      "encrypted-media",
      "gyroscope",
      "picture-in-picture",
    ];

    if (allowAutoPlay) permissions.push("autoplay");

    return permissions.join("; ");
  }, [allowAutoPlay]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-medium bg-black ${ASPECT_RATIO_CLASS[aspectRatio]} ${className}`}
    >
      <iframe
        src={src}
        title={title}
        allow={allow}
        allowFullScreen={allowFullScreen}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default CustomIframe;
