'use client';

import React, { useState } from "react";
import style from "@/src/styles/adminSide/adminUsers.module.scss";
import uiStyle from "@/src/styles/adminSide/adminHome.module.scss";
import baseStyle from "@/src/styles/adminSide/adminBase.module.scss";
import UserEditor from "@/src/components/adminSide/adminHome/userEditor";

function Page() {
	const [showUserEditor, setShowUserEditor] = useState(false);

	return (
		<>
			<div className={style.content}>
				<div className={style.userEditor}>
					<UserEditor />
				</div>
			</div>
		</>
	);
}

export default Page;
