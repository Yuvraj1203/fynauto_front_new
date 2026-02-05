enum PreloadEnum {
  None = "none",
  Metadata = "metadata",
  Auto = "auto",
}
type CustomVideoProps = {
  width?: number;
  height?: number;
  controls?: boolean;
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: PreloadEnum;
};

const CustomVideo = ({ controls = false, ...props }: CustomVideoProps) => {
  const playsInlineForIos = props.autoPlay ? true : false;
  return (
    <video
      width={props.width}
      height={props.height}
      controls={controls}
      autoPlay={props.autoPlay}
      loop={props.loop}
      muted={props.muted}
      preload={props.preload}
      playsInline={playsInlineForIos}
    >
      <source src={props.src} type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  );
};

export default CustomVideo;
