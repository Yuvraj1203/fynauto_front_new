import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";
import { ReactNode } from "react";

export enum CardRadiusAndShadowEnum {
  none = "none",
  sm = "sm",
  md = "md",
  lg = "lg",
}

type CustomCardProps = {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  divider?: boolean;
  headerStyle?: string;
  bodyStyle?: string;
  footerStyle?: string;
  isFooterBlurred?: boolean;
  isBlurred?: boolean;
  onClick?: () => void;
  imageBody?: ReactNode;
  radius?: CardRadiusAndShadowEnum;
  shadow?: CardRadiusAndShadowEnum;
  className?: string;
  baseStyle?: string;
};

const CustomCard = ({
  radius = CardRadiusAndShadowEnum.md,
  shadow = CardRadiusAndShadowEnum.none,
  footerStyle = "bg-muted/30 shadow-inset",
  baseStyle = "shadow-xs transition-all duration-200 hover:shadow-sm",
  ...props
}: CustomCardProps) => {
  return (
    <Card
      isFooterBlurred={props.isFooterBlurred}
      isBlurred={props.isBlurred}
      isPressable={props.onClick ? true : false}
      onPress={props.onClick}
      radius={radius}
      shadow={shadow}
      className={props.className}
      classNames={{
        base: `${baseStyle}`,
        header: `px-4 pt-4`,
        body: `px-4`,
        footer: `px-4`,
      }}
    >
      {props.header && (
        <CardHeader className={props.headerStyle}>{props.header}</CardHeader>
      )}
      {props.divider && <Divider />}
      {props.imageBody
        ? props.imageBody
        : props.children && (
            <CardBody className={props.bodyStyle}>{props.children}</CardBody>
          )}
      {props.divider && <Divider />}
      {props.footer && (
        <CardFooter className={footerStyle}>{props.footer}</CardFooter>
      )}
    </Card>
  );
};

export default CustomCard;
