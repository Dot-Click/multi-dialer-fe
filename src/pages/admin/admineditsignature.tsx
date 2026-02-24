import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSignature } from '@/hooks/useSignature';
import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon,
  Minus
} from 'lucide-react';

const AdminEditSignature = () => {
  const navigate = useNavigate();
  const { getSignature, saveSignature, loading, error } = useSignature();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '<p>Loading signature...</p>',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[60vh] p-2 prose prose-sm max-w-none',
      },
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      const signature = await getSignature();
      if (signature && editor) {
        editor.commands.setContent(signature.content);
      } else if (editor) {
        editor.commands.setContent('<p>Write your signature here...</p>');
        if (error) {
          toast.error(error);
        }
      }
    };
    fetchContent();
  }, [editor, error]);

  const handleCancel = () => navigate(-1);

  const handleSave = async () => {
    if (!editor) return;
    const html = editor.getHTML();

    const result = await saveSignature(html);
    if (result) {
      toast.success('Signature saved successfully');
      navigate(-1);
    } else {
      toast.error('Failed to save signature');
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen font-sans">
      <div className="mx-auto px-4 sm:px-6 lg:px-2">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-950">
            Edit Signature
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-5 py-2.5 w-28 rounded-lg bg-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2.5 w-28 rounded-lg bg-[#FFCA06] text-gray-950 font-semibold text-sm hover:bg-[#f1c00e] transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </header>

        {/* Editor Card */}
        <main className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[75vh]">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200">

            {/* Text formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>

            <Divider />

            {/* Alignment */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>

            <Divider />

            {/* Color */}
            <label title="Text Color" className="cursor-pointer p-1.5 rounded hover:bg-gray-100">
              <input
                type="color"
                className="w-4 h-4 cursor-pointer rounded border-0"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              />
            </label>

            <Divider />

            {/* Link & Image */}
            <ToolbarButton onClick={addLink} title="Add Link">
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton onClick={addImage} title="Add Image">
              <ImageIcon className="w-4 h-4" />
            </ToolbarButton>

            <Divider />

            {/* Horizontal Rule */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Divider Line"
            >
              <Minus className="w-4 h-4" />
            </ToolbarButton>

          </div>

          {/* Editor Area */}
          <div className="p-4">
            <EditorContent editor={editor} />
          </div>

        </main>
      </div>
    </div>
  );
};

// Reusable toolbar button
const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    title={title}
    type="button"
    className={`p-1.5 rounded transition-colors duration-150 ${active
      ? 'bg-[#FFCA06] text-gray-950'
      : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1" />;

export default AdminEditSignature;