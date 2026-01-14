import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import styled from 'styled-components';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EditorContainer = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-height: 150px;
  
  &:focus-within {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .tiptap {
    padding: 8px 11px;
    min-height: 150px;
    outline: none;
    
    p {
      margin: 0.5em 0;
    }

    ul, ol {
      padding-left: 1.5em;
      margin: 0.5em 0;
    }

    h1, h2, h3 {
      margin: 0.5em 0;
      font-weight: bold;
    }

    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.17em; }

    strong { font-weight: bold; }
    em { font-style: italic; }
    
    &.ProseMirror-focused {
      outline: none;
    }
  }
`;

const Toolbar = styled.div`
  border-bottom: 1px solid #d9d9d9;
  padding: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  background: #fafafa;
  border-radius: 4px 4px 0 0;
`;

const ToolbarButton = styled.button<{ isActive?: boolean }>`
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: ${props => props.isActive ? '#1890ff' : 'white'};
  color: ${props => props.isActive ? 'white' : 'rgba(0, 0, 0, 0.85)'};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.isActive ? '#40a9ff' : '#f5f5f5'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          type="button"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          type="button"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          type="button"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          type="button"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          type="button"
        >
          • Lista
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          type="button"
        >
          1. Lista
        </ToolbarButton>
      </Toolbar>
      <EditorContent editor={editor} placeholder={placeholder} />
    </EditorContainer>
  );
};

export default TiptapEditor;
