import { Input, InputProps } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "@/shared/styles/globals.css";

export const InputPassword = ({ type = "text", ...props }: InputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (isVisible ? "text" : "password") : type;

  return (
    <Input
      {...props}
      type={inputType}
      labelPlacement="outside"
      endContent={
        isPassword && (
          <button
            type="button"
            aria-label="Показать или скрыть пароль"
            onClick={() => setIsVisible((prev) => !prev)}
            className="input-password__toggle"
          >
            {isVisible ? (
              <EyeOff className="input-password__icon" />
            ) : (
              <Eye className="input-password__icon" />
            )}
          </button>
        )
      }
      className="input-password"
    />
  );
};
