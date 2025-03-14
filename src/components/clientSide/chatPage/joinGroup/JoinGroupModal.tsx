import React, { useEffect } from "react";
import Modal from "react-modal";
import FormContent from "./FormContent";
import style from "@/src/styles/clientSide/chatPage/ChatGroups.module.scss";
import style2 from "@/src/styles/clientSide/chatPage/joinGroup/FormContent.module.scss"

interface JoinGroupModalProps {
	isOpen: boolean;
	onClose: () => void;
	onJoinGroup: (arg0: string) => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
	isOpen,
	onClose,
	onJoinGroup,
}) => {
	useEffect(() => {
		Modal.setAppElement(document.body);
	}, []);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className={style.modalContent + " " + style2.modalContent}
			overlayClassName={style.modalOverlay}
		>
			<h2>Join a New Group</h2>
			<FormContent onSubmit={onJoinGroup}/>
		</Modal>
	);
};

export default JoinGroupModal;