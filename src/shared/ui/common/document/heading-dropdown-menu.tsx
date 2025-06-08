import React from 'react';
import { Editor } from '@tiptap/react';

type Props = {
  editor: Editor;
  levels?: number[];
};

export const HeadingDropdownMenu: React.FC<Props> = ({
                                                       editor,
                                                       levels = [1, 2, 3, 4, 5, 6],
                                                     }) => {
  if (!editor) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 0;

    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };


  const currentLevel = levels.find((level) =>
    editor.isActive('heading', { level })
  ) ?? 0;

  return (
    <select
      onChange={handleChange}
      value={currentLevel}
      className="heading-dropdown"
    >
      <option value={0}>Обычный</option>
      {levels.map((level) => (
        <option key={level} value={level}>
          {`Заголовок ${level}`}
        </option>
      ))}
    </select>
  );
};
