import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {
	EditorContent,
	NodeViewContent,
	NodeViewWrapper,
	ReactNodeViewRenderer,
	useEditor,
} from "@tiptap/react";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { all, createLowlight } from "lowlight";

import "./editor.css";

const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export default function Texteditor() {
	const [content, setContent] = useState("");
	const editor = useEditor({
		immediatelyRender: true,
		shouldRerenderOnTransaction: false,
		extensions: [
			StarterKit,
			Highlight,
			Typography,
			Document,
			Paragraph,
			Text,
			CodeBlockLowlight.extend({
				addNodeView() {
					return ReactNodeViewRenderer(CodeBlockComponent);
				},
			}).configure({ lowlight }),
		],
		content: "",
		onUpdate: ({ editor }) => {
			console.dir(editor.getHTML());
		},
	});
	return <EditorContent editor={editor} />;
}

function CodeBlockComponent({
	node: {
		attrs: { language: defaultLanguage },
	},
	updateAttributes,
	extension,
}) {
	return (
		<NodeViewWrapper className="code-block">
			<select
				contentEditable={false}
				defaultValue={defaultLanguage}
				onChange={(event) => updateAttributes({ language: event.target.value })}
			>
				<option value="null">auto</option>
				<option disabled>—</option>
				{extension.options.lowlight.listLanguages().map((lang, index) => (
					<option key={index} value={lang}>
						{lang}
					</option>
				))}
			</select>
			<pre>
				<NodeViewContent as="code" />
			</pre>
		</NodeViewWrapper>
	);
}
