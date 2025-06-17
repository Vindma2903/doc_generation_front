import { Mark } from "@tiptap/core"
import { nanoid } from "nanoid"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    styleMark: {
      applyStyle: (styleObj: Record<string, string>) => ReturnType
    }
  }
}

export const StyleMark = Mark.create({
  name: "styleMark",
  excludes: '',

  addOptions() {
    return {
      editor: null,
    }
  },

  addAttributes() {
    return {
      styleId: {
        default: null,
        parseHTML: el => el.getAttribute("data-style-id"),
        renderHTML: attrs => (
          attrs.styleId ? { "data-style-id": attrs.styleId } : {}
        ),
      },
      style: {
        default: null,
        parseHTML: el => el.getAttribute("style"),
        renderHTML: attrs => (
          attrs.style ? { style: attrs.style } : {}
        ),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "span[data-style-id]",
        getAttrs: el => {
          const styleId = (el as HTMLElement).getAttribute("data-style-id")
          const style = (el as HTMLElement).getAttribute("style")
          return { styleId, style }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { styleId, style } = HTMLAttributes

    const renderedAttrs: Record<string, string> = {}

    if (styleId) {
      renderedAttrs["data-style-id"] = styleId
    }

    if (style) {
      renderedAttrs["style"] = style
    }

    return ["span", renderedAttrs, 0]
  },

  addCommands() {
    return {
      applyStyle:
        (styleObj: Record<string, string>) =>
          ({ chain }) => {
            const styleStr = Object.entries(styleObj)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
              .join("; ")

            const editorStyles = this.options.editor?.storage?.templateStyles
            let styleId: string | undefined

            if (editorStyles && Array.isArray(editorStyles)) {
              const existing = editorStyles.find((s: any) =>
                s.scope === "inline" &&
                Object.entries(styleObj).every(([k, v]) => s.styles[k] === v)
              )

              if (existing) {
                const match = existing.selector.match(/span\[data-style-id="(.+?)"\]/)
                styleId = match?.[1]
              }
            }

            if (!styleId) {
              styleId = nanoid()
            }

            return chain()
              .unsetMark("styleMark")
              .setMark("styleMark", {
                styleId,
                style: styleStr,
              })
              .run()
          },
    }
  },
})
