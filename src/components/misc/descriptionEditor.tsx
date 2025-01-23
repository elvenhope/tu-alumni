import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import style from "@/src/styles/misc/descriptionEditor.module.scss"

interface DescriptionEditorProps {
	description: string;
	onUpdateDescription: (newDescription: string) => void;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
	description,
	onUpdateDescription,
}) => {
	const [content, setContent] = useState<string>(description);

	const editor = useEditor({
		extensions: [StarterKit],
		content: content,
		onUpdate({ editor }) {
			const updatedContent = editor.getHTML();
			setContent(updatedContent);
			onUpdateDescription(updatedContent);
		},
	});

	useEffect(() => {
		setContent(description);
		editor?.commands.setContent(description);
	}, [description]);

	return (
		<div className={style.descriptionEditor}>
			<label htmlFor="description">Description:</label>
			<div className={style.toolbar}>
				{/* Formatting Buttons */}
				<button
					onClick={() => editor?.chain().focus().toggleBold().run()}
					disabled={
						!editor ||
						!editor.can().chain().focus().toggleBold().run()
					}
					className={editor?.isActive("bold") ? "is-active" : ""}
					type="button"
				>
					Bold
				</button>
				<button
					onClick={() => editor?.chain().focus().toggleItalic().run()}
					disabled={
						!editor ||
						!editor.can().chain().focus().toggleItalic().run()
					}
					className={editor?.isActive("italic") ? "is-active" : ""}
					type="button"
				>
					Italic
				</button>
				<button
					onClick={() => editor?.chain().focus().toggleStrike().run()}
					disabled={
						!editor ||
						!editor.can().chain().focus().toggleStrike().run()
					}
					className={editor?.isActive("strike") ? "is-active" : ""}
					type="button"
				>
					Strike
				</button>
				<button
					onClick={() =>
						editor?.chain().focus().toggleBulletList().run()
					}
					disabled={
						!editor ||
						!editor.can().chain().focus().toggleBulletList().run()
					}
					className={
						editor?.isActive("bulletList") ? "is-active" : ""
					}
					type="button"
				>
					Bullet Points
				</button>
			</div>

			{/* TipTap Editor Content */}
			<EditorContent editor={editor} className={style.editorContent}/>
		</div>
	);
};

export default DescriptionEditor;
