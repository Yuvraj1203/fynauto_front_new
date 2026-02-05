import { Text, TextVariant } from "@/components/common";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
      <Text variant={TextVariant.bodyLg} className="text-primary font-medium">
        Page Not Found root
      </Text>
      <Text variant={TextVariant.bodySm} className="text-on-default-100 mt-2">
        The page you’re looking for doesn’t exist or has been moved.
      </Text>
    </div>
  );
}
