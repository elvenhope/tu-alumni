import React, { useEffect } from "react";
import Modal from "react-modal";
import GroupForm from "./GroupForm";
import style from "@/src/styles/clientSide/chatPage/ChatGroups.module.scss";

interface CreateGroupModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateGroup: (values: {
		name: string;
		description: string;
		tags: string[];
	}) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
	isOpen,
	onClose,
	onCreateGroup,
}) => {

	useEffect(() => {
		Modal.setAppElement(document.body);
	}, []);

	
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className={style.modalContent}
			overlayClassName={style.modalOverlay}
		>
			<h2>Create a New Group</h2>
			<GroupForm onSubmit={onCreateGroup} onCancel={onClose} />
		</Modal>
	);
};

export default CreateGroupModal;