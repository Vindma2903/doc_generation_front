import { Input as HeroInput, InputProps } from "@heroui/react";

export const Input = (props: InputProps) => {
  return (
    <HeroInput
      {...props}
      className={`input-unified ${props.className ?? ""}`}
      labelPlacement="outside"
    />
  );
};

