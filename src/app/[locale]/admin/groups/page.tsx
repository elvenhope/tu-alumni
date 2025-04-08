"use client";

import React, { useEffect, useState } from "react";
import { Group } from "@/src/types/types";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import GroupEditor from "@/src/components/adminSide/adminHome/GroupEditor";

function Page() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [groupOptions, setGroupOptions] = useState<
		Array<{ value: Group; label: string }>
	>([]);

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const res = await fetch("/api/admin/groups");
				if (!res.ok) {
					throw new Error(
						`Failed to fetch groups: ${res.statusText}`
					);
				}
				const groupsData: Group[] = await res.json();
				setGroups(groupsData);
				const options = groupsData.map((group) => ({
					value: group,
					label: group.name,
				}));
				setGroupOptions(options);
			} catch (err) {
				console.error(err);
			}
		};

		fetchGroups();
	}, []);

	return (
		<div className={style.content}>
			<h1>Editing Groups</h1>
			<div className={style.selections}>
				<GroupEditor selectOptions={groupOptions} />
			</div>
		</div>
	);
}

export default Page;
