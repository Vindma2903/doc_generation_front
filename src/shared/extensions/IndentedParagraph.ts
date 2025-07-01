// src/shared/extensions/IndentedParagraph.ts
import Paragraph from "@tiptap/extension-paragraph"

export const IndentedParagraph = Paragraph.extend({
  name: "paragraph", // обязательно — иначе TextAlign не сработает

  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: "left",
        parseHTML: el => {
          const align = el.style.textAlign || "left"
          console.log("[parseHTML] textAlign:", align, " | el:", el)
          return align
        },
        renderHTML: attrs => {
          console.log("[renderHTML] attrs.textAlign:", attrs.textAlign)
          if (!attrs.textAlign) return {}
          return {
            style: `text-align: ${attrs.textAlign}`,
          }
        },
      },
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTextAlign:
        alignment =>
          ({ commands }) => {
            console.log("[setTextAlign] alignment requested:", alignment)
            return commands.updateAttributes(this.name, { textAlign: alignment })
          },
    }
  },
})
