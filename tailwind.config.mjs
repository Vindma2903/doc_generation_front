import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Основной файл HTML
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Все файлы в папке src
    "./node_modules/@heroui/theme/dist/**/*.js", // Стили NextUI
  ],
  theme: {
    extend: {
      colors: {
        invalid: "#A82525",
        placeholder: "#7D8592",
        borderL: "#f6f6f6",
        borderM: "#d7d6d6",
        borderD: "#E4E4E7",
      },
      lineHeight: {
        none: "1", // Класс для высоты строки "leading-none"
        tight: "1.25", // Уменьшенная высота строки
        normal: "1.5", // Стандартная высота строки
        relaxed: "1.75", // Увеличенная высота строки
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "6px",
      },
      borderWidth: {
        sm: "1px",
        md: "2px",
        lg: "3px",
      },
    },
  },
  darkMode: "class", // Поддержка тёмной темы через класс
  plugins: [
    heroui({
      addCommonColors: true, // Добавляет стандартные цвета NextUI
      layout: {
        disabledOpacity: "0.3",
        radius: {
          small: "2px",
          medium: "4px",
          large: "6px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#2e2e2e",
            primary: {
              DEFAULT: "#615EF0",
              foreground: "#ffffff",
            },
            focus: "#8280FF",
            divider: "#f6f6f6",
          },
        },
        dark: {
          colors: {
            background: "#2e2e2e",
            foreground: "#ffffff",
            primary: {
              DEFAULT: "#3BF973",
              foreground: "#000000",
            },
            focus: "#3BF973",
            divider: "#f6f6f6",
          },
        },
      },
    }),
  ],
};
