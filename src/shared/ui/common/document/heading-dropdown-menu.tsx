import React, { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'

type Props = {
  editor: Editor
  levels?: (1 | 2 | 3 | 4 | 5 | 6)[]
}

export const HeadingDropdownMenu: React.FC<Props> = ({
                                                       editor,
                                                       levels = [1, 2, 3],
                                                     }) => {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [isInsideActions, setIsInsideActions] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setHovered(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const applyStyle = (level: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!editor) return
    const chain = editor.chain().focus()

    // Привязка размера шрифта к каждому уровню заголовка
    const fontSizeMap: Record<number, string> = {
      0: '16px', // обычный текст
      1: '32px',
      2: '28px',
      3: '24px',
      4: '20px',
      5: '18px',
      6: '16px',
    }

    if (level === 0) {
      chain.setParagraph().setFontSize(fontSizeMap[0]).run()
    } else {
      chain.toggleHeading({ level }).setFontSize(fontSizeMap[level]).run()
    }

    setOpen(false)
  }


  const updateStyle = (level: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    alert(`Стиль заголовка ${level} обновлён (заглушка).`)
    setOpen(false)
  }

  const currentLevel =
    levels.find((lvl) => editor.isActive('heading', { level: lvl })) ?? 0

  return (
    <div
      className="heading-menu"
      ref={dropdownRef}
      onMouseEnter={() => {
        if (hoverTimeout) clearTimeout(hoverTimeout)
        setOpen(true)
      }}
      onMouseLeave={() => {
        const timeout = setTimeout(() => {
          setOpen(false)
          setHovered(null)
        }, 200)
        setHoverTimeout(timeout)
      }}
    >
      <button className="heading-menu-trigger">
        {currentLevel === 0 ? 'Обычный' : `Заголовок ${currentLevel}`}
      </button>

      {open && (
        <div className="heading-menu-body">
          <ul className="heading-menu-list">
            <li
              className="heading-menu-item-wrapper"
              style={{ position: 'relative' }}
              onMouseEnter={() => setHovered(0)}
              onMouseLeave={() => {
                if (!isInsideActions) setHovered(null)
              }}
            >
              <div
                className={`heading-menu-item ${currentLevel === 0 ? 'is-active' : ''}`}
                onClick={() => applyStyle(0)}
              >
                Обычный
              </div>

              {hovered === 0 && (
                <div
                  className="heading-menu-actions"
                  onMouseEnter={() => {
                    setHovered(0)
                    setIsInsideActions(true)
                  }}
                  onMouseLeave={() => {
                    setIsInsideActions(false)
                    setHovered(null)
                  }}
                >
                  <button onClick={() => applyStyle(0)}>Применить</button>
                  <button onClick={() => updateStyle(0)}>Обновить</button>
                </div>
              )}
            </li>

            {levels.map((level) => (
              <li
                key={level}
                className="heading-menu-item-wrapper"
                style={{ position: 'relative' }}
                onMouseEnter={() => setHovered(level)}
                onMouseLeave={() => {
                  if (!isInsideActions) setHovered(null)
                }}
              >
                <div
                  className={`heading-menu-item ${currentLevel === level ? 'is-active' : ''}`}
                  onClick={() => applyStyle(level)}
                >
                  Заголовок {level}
                </div>

                {hovered === level && (
                  <div
                    className="heading-menu-actions"
                    onMouseEnter={() => {
                      setHovered(level)
                      setIsInsideActions(true)
                    }}
                    onMouseLeave={() => {
                      setIsInsideActions(false)
                      setHovered(null)
                    }}
                  >
                    <button onClick={() => applyStyle(level)}>Применить</button>
                    <button onClick={() => updateStyle(level)}>Обновить</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
