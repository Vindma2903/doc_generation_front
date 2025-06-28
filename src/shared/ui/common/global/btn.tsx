// src/shared/ui/common/global/btn.tsx
import { Button as HeroButton, ButtonProps } from "@heroui/react";

export const Button = (props: ButtonProps) => {
  return <HeroButton color="primary" variant="solid" {...props} />;
};
