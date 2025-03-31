import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import UserCard from "@/src/components/clientSide/chatPage/userPage/UserCard";
import style from "@/src/styles/clientSide/chatPage/ChatGroups.module.scss";
import { User } from "@/src/types/types";
import { fetchUserInfoFrom_Id } from "@/src/lib/fetchUserInfo";

interface UserCardModalProps {
	isOpen: boolean;
	onClose: () => void;
	userId: string | null;
}

const customStyle = {
	blue: {
		backgroundColor: "#233774",
	},
};

const UserCardModal: React.FC<UserCardModalProps> = ({
	isOpen,
	onClose,
	userId,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!userId || !isOpen) return;

		setLoading(true);
		fetchUserInfoFrom_Id(userId)
			.then((data) => {
				setUser(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching user:", error);
				setLoading(false);
			});
	}, [userId, isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className={style.modalContent}
			overlayClassName={style.modalOverlay}
			style={{ content: customStyle.blue }}
		>
			{loading ? (
				<p>Loading...</p>
			) : user ? (
				<UserCard user={user} />
			) : (
				<p>User not found.</p>
			)}
		</Modal>
	);
};

export default UserCardModal;
