// src/shared/extensions/IndentedParagraph.ts
import Paragraph from "@tiptap/extension-paragraph"

export const IndentedParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: el => el.getAttribute("style"),
        renderHTML: attrs => (attrs.style ? { style: attrs.style } : {}),
      },
    }
  },
})
