"use client";

import React from "react";
import style from "@/src/styles/misc/Modal.module.scss";

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
	return (
		<div className={style.overlay} onClick={onClose}>
			<div
				className={style.modal}
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
			>
				<button className={style.closeButton} onClick={onClose}>
					x
				</button>
				<div className={style.content}>{children}</div>
			</div>
		</div>
	);
}
