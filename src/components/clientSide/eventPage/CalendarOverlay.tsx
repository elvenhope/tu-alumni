import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import {
	IoCalendarOutline,
	IoChevronBack,
	IoChevronForward,
} from "react-icons/io5";
import style from "@/src/styles/misc/calendarOverlay.module.scss";
import { Event } from "@/src/types/types";


interface props {
	events: Event[];
	locale: string;
	dateSelected: (date: Date) => void
}

const CalendarOverlay = ({ events, locale, dateSelected }: props) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [showCalendar, setShowCalendar] = useState(false);
	const overlayRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				overlayRef.current &&
				!(overlayRef.current as HTMLElement).contains(
					event.target as Node
				)
			) {
				setShowCalendar(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);


	const startOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		1
	);
	const endOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0
	);
	const daysInMonth = endOfMonth.getDate();
	const dayOfWeek = startOfMonth.getDay();

	const handlePrevMonth = () =>
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
		);
	const handleNextMonth = () =>
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
		);

	const renderDays = () => {
		const days = [];
		for (let i = 1; i < (dayOfWeek == 0 ? 7 : dayOfWeek); i++) {
			days.push(<div key={`empty-${i}`} className={style.empty}></div>);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				day
			);

			const eventDay = events.find(
				(e) =>
					e.day === day &&
					e.month === currentDate.getMonth() + 1 &&
					e.year === currentDate.getFullYear()
			);
			

			const isSunday = date.getDay() === 0;

			const styleString =(eventDay ? style.eventDay : "") + " " + (isSunday ? style.sunday : "")

			days.push(
				<div
					key={day}
					className={`${style.day} ${styleString}`}
					onClick={() => dateSelected(date)}
				>
					{day}
				</div>
			);
		}

		const emptyEndSlots =
			7 - (endOfMonth.getDay() == 0 ? 7 : endOfMonth.getDay());
		for (let i = 0; i < emptyEndSlots; i++) {
			days.push(
				<div key={`empty-end-${i}`} className={style.empty}></div>
			);
		}

		return days;
	};

	return (
		<div>
			<div className={style.calendarDiv} ref={overlayRef}>
				<IoCalendarOutline
					size={60}
					onClick={() => setShowCalendar(!showCalendar)}
				/>
				{showCalendar && (
					<div className={style.calendarOverlay}>
						<div className={style.header}>
							<IoChevronBack onClick={handlePrevMonth} />
							<span>
								{currentDate.toLocaleString(locale, {
									month: "long",
									year: "numeric",
								})}
							</span>
							<IoChevronForward onClick={handleNextMonth} />
						</div>
						<div className={style.legend}>
							{Array.from({ length: 7 }).map((_, index) => (
								<div key={index} className={style.legendItem}>
									{new Intl.DateTimeFormat(locale, {
										weekday: "narrow",
									}).format(new Date(2025, 0, index + 6))}
								</div>
							))}
						</div>
						<div className={style.daysGrid}>{renderDays()}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CalendarOverlay;
