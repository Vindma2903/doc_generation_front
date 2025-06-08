import { Mark, mergeAttributes } from "@tiptap/core"

export interface FontSizeOptions {
  types: string[]
  defaultSize: string
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

const allowedSizes = [
  "10px", "12px", "14px", "16px", "18px", "20px",
  "24px", "28px", "32px", "36px", "48px", "72px"
]

export const FontSize = Mark.create<FontSizeOptions>({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
      defaultSize: "16px",
    }
  },

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {}
          return { style: `font-size: ${attributes.fontSize}` }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        style: "font-size",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontSize:
        (size: string) =>
          ({ chain }) => {
            if (!allowedSizes.includes(size)) return false
            return chain().setMark("fontSize", { fontSize: size }).run()
          },

      unsetFontSize:
        () =>
          ({ chain }) => {
            return chain().unsetMark("fontSize").run()
          },
    }
  },
})
