import "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    styleMark: {
      applyStyle: (styleObj: Record<string, string>) => ReturnType
    }
  }
}
