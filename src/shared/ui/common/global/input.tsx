import { Input as HeroInput, InputProps } from "@heroui/react";

export const Input = (props: InputProps) => {
  return (
    <HeroInput
      {...props}
      labelPlacement="outside" // 👈 это размещает лейбл над полем
    />
  );
};
