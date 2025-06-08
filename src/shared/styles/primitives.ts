import { tv } from "tailwind-variants"

export const input = tv({
  base: "w-full focus:outline-none focus:ring-2 focus:ring-blue-500", // Базовые стили
  variants: {
    fullWidth: {
      true: "w-full", // Ширина на весь экран
      false: "w-auto", // Автоматическая ширина
    },
  },
  defaultVariants: {
    fullWidth: true, // Установка дефолтного значения для fullWidth
  },
})
