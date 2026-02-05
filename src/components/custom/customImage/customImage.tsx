"use client";
import Image from "next/image";

export enum ImageType {
  png = "png",
  svg = "svg",
}

type CustomImageProps = {
  src: string | any;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  type?: ImageType;
  onClick?: () => void;
  containerStyle?: string;
  fill?: boolean;
};

const CustomImage = ({
  width,
  height,
  type = ImageType.png,
  containerStyle,
  alt = "image",
  ...props
}: CustomImageProps) => {
  if (type == ImageType.svg) {
    const Icon = props.src;

    return (
      <span
        onClick={props.onClick}
        className={`h-[${height}px] w-[${width}px] ${props.className}`}
      >
        <Icon />
      </span>
    );
  }

  return (
    <Image
      onClick={props.onClick}
      src={props.src}
      width={width}
      height={height}
      alt={alt}
      className={`${props.className}`}
      fill={props.fill}
    />
  );
};

export default CustomImage;
