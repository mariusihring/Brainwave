import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
	BubbleMenu,
	Editor,
	EditorContent,
	FloatingMenu,
	useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { DOMSerializer } from "prosemirror-model";
import { MarkdownParser, MarkdownSerializer } from "prosemirror-markdown";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/notes/markdown/")({
	component: () => <MarkdownEditor />,
});

const lowlight = createLowlight(all);

// Custom styles for syntax highlighting
const createSyntaxHighlightingExtension = () => {
	return CodeBlockLowlight.configure({
		lowlight,
	});
};

function MenuBar({ editor }: { editor: Editor | null }) {
	if (!editor) return null;

	const getMarkdown = () => {
		if (!editor) return "";
		const serializer = new MarkdownSerializer(editor.schema);
		const doc = editor.state.doc;
		return serializer.serialize(doc);
	};

	return (
		<div className="sticky top-0 bg-background border-b border-border z-10">
			<div className="flex flex-wrap gap-1 p-2">
				<div className="flex gap-1">
					<Button
						variant={editor.isActive("bold") ? "secondary" : "outline"}
						size="sm"
						onClick={() => editor.chain().focus().toggleBold().run()}
						disabled={!editor.can().chain().focus().toggleBold().run()}
					>
						Bold
					</Button>
					<Button
						variant={editor.isActive("italic") ? "secondary" : "outline"}
						size="sm"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						disabled={!editor.can().chain().focus().toggleItalic().run()}
					>
						Italic
					</Button>
					<Button
						variant={editor.isActive("code") ? "secondary" : "outline"}
						size="sm"
						onClick={() => editor.chain().focus().toggleCode().run()}
						disabled={!editor.can().chain().focus().toggleCode().run()}
					>
						Inline Code
					</Button>
				</div>

				<div className="flex gap-1">
					<Button
						variant={
							editor.isActive("heading", { level: 1 }) ? "secondary" : "outline"
						}
						size="sm"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
					>
						H1
					</Button>
					<Button
						variant={
							editor.isActive("heading", { level: 2 }) ? "secondary" : "outline"
						}
						size="sm"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
					>
						H2
					</Button>
					<Button
						variant={
							editor.isActive("heading", { level: 3 }) ? "secondary" : "outline"
						}
						size="sm"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
					>
						H3
					</Button>
				</div>

				<div className="flex gap-1">
					<Button
						variant={editor.isActive("bulletList") ? "secondary" : "outline"}
						size="sm"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					>
						Bullet List
					</Button>
					<Button
						variant={editor.isActive("orderedList") ? "secondary" : "outline"}
						size="sm"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					>
						Ordered List
					</Button>
				</div>

				<div className="flex gap-1">
					<Button
						variant={editor.isActive("blockquote") ? "secondary" : "outline"}
						size="sm"
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					>
						Quote
					</Button>
					<Button
						variant={editor.isActive("codeBlock") ? "secondary" : "outline"}
						size="sm"
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					>
						Code Block
					</Button>
				</div>

				<div className="flex gap-1 ml-auto">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							const markdown = getMarkdown();
							console.log("Markdown:", markdown);
						}}
					>
						Get Markdown
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().chain().focus().undo().run()}
					>
						Undo
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().chain().focus().redo().run()}
					>
						Redo
					</Button>
				</div>
			</div>
		</div>
	);
}

function MarkdownEditor() {
	const [content, setContent] = useState(`<p>
          That's a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>`);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: false,
			}),
			TextStyle,
			Color,
			ListItem,
			createSyntaxHighlightingExtension(),
		],
		content,
		onUpdate: ({ editor }) => {
			setContent(editor.getHTML());
			console.log(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose dark:prose-invert prose-slate max-w-none focus:outline-none min-h-[500px] px-4 py-2 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4 prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-blockquote:text-foreground/80 prose-strong:text-foreground prose-em:text-foreground [&_.hljs-keyword]:text-pink-500 [&_.hljs-string]:text-green-400 [&_.hljs-number]:text-blue-400 [&_.hljs-function]:text-blue-500 [&_.hljs-title]:text-blue-500 [&_.hljs-attr]:text-purple-500 [&_.hljs-comment]:text-gray-500 [&_.hljs-operator]:text-rose-500 [&_.hljs-punctuation]:text-gray-400 [&_.hljs-property]:text-purple-400 [&_.hljs-class]:text-yellow-500 dark:[&_.hljs-keyword]:text-pink-400 dark:[&_.hljs-string]:text-green-300 dark:[&_.hljs-number]:text-blue-300 dark:[&_.hljs-function]:text-blue-400 dark:[&_.hljs-title]:text-blue-400 dark:[&_.hljs-attr]:text-purple-400 dark:[&_.hljs-comment]:text-gray-400 dark:[&_.hljs-operator]:text-rose-400 dark:[&_.hljs-punctuation]:text-gray-300 dark:[&_.hljs-property]:text-purple-300 dark:[&_.hljs-class]:text-yellow-400",
			},
		},
	});

	return (
		<div className="w-full border border-border rounded-lg overflow-hidden bg-background">
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />

			<BubbleMenu
				className="bg-popover border border-border shadow-lg rounded-lg p-1 flex gap-1 animate-in fade-in-0 zoom-in-95"
				editor={editor}
			>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor?.chain().focus().toggleBold().run()}
				>
					Bold
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor?.chain().focus().toggleItalic().run()}
				>
					Italic
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor?.chain().focus().toggleCode().run()}
				>
					Code
				</Button>
			</BubbleMenu>

			<FloatingMenu
				className="bg-popover border border-border shadow-lg rounded-lg p-1 flex flex-col gap-1 animate-in fade-in-0 zoom-in-95"
				editor={editor}
			>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						editor?.chain().focus().toggleHeading({ level: 1 }).run()
					}
				>
					Heading 1
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						editor?.chain().focus().toggleHeading({ level: 2 }).run()
					}
				>
					Heading 2
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
				>
					Code Block
				</Button>
			</FloatingMenu>
		</div>
	);
}
