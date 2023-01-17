import { useState, useEffect } from 'react';
import { useAPIContext } from '../../Context/API.Context';
import styles from './MeetingBase.module.css';

export const MeetingBase = ({
	title,
	description,
	userId1,
	userId2,
	id,
	createdBy,
	dateDueBy,
	meetingComplete,
	refetchMeetings,
}) => {
	const { deleteMeeting, updateMeeting, getAllUsers } = useAPIContext();
	const [modal, setModal] = useState(false);
	const [creator, setCreator] = useState('');
	const [firstUser, setFirstUser] = useState('');
	const [secondUser, setSecondUser] = useState('');
	const dateDueByFormatted = new Date(dateDueBy).toString();

	const getTimeRemaining = (dateDueBy) => {
		const total = Date.parse(dateDueBy) - Date.parse(new Date());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
		const days = Math.floor(total / (1000 * 60 * 60 * 24));

		return {
			total,
			days,
			hours,
			minutes,
			seconds,
		};
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleModalEventListener = (e) => {
		if (modal) {
			if (e.key === 'Escape') {
				document.body.classList.remove('activeModal');
				setModal(false);
			}
		}
	};

	useEffect(() => {
		getAllUsers().then((res) => {
			if (res.data) {
				const findCreator = res.data.find(
					(user) => user.meta.userTaskId === createdBy
				);
				setCreator(findCreator.firstName + ' ' + findCreator.lastName);

				const findFirstUser = res.data.find(
					(user) => user.meta.userTaskId === userId1
				);
				setFirstUser(
					findFirstUser.firstName + ' ' + findFirstUser.lastName
				);

				const findSecondUser = res.data.find(
					(user) => user.meta.userTaskId === userId2
				);
				setSecondUser(
					findSecondUser.firstName + ' ' + findSecondUser.lastName
				);
			}
		});
	}, [createdBy, getAllUsers, userId1, userId2]);

	useEffect(() => {
		document.addEventListener('keydown', handleModalEventListener);

		return () => {
			document.removeEventListener('keydown', handleModalEventListener);
		};
	}, [handleModalEventListener]);

	const handleMeetingModal = () => {
		if (modal) {
			document.body.classList.remove('activeModal');
			setModal(false);
		} else if (!modal) {
			document.body.classList.add('activeModal');
			setModal(true);
		}
	};

	const handleDelete = () => {
		deleteMeeting(id).then((res) => {
			if (res.data) {
				refetchMeetings();
				return res.toast;
			} else {
				return res.toast;
			}
		});
	};

	const handleMeetingComplete = () => {
		const updatedMeeting = !meetingComplete;
		updateMeeting(id, updatedMeeting).then((res) => {
			if (res.data) {
				refetchMeetings();
				return res.toast;
			} else {
				return res.toast;
			}
		});
	};

	return (
		<>
			<div className={styles.taskWrap}>
				<div
					onClick={handleMeetingModal}
					title='Click to view task details'
					style={{ cursor: 'pointer', marginBottom: '-10px' }}
				>
					<div className={`${styles.pTruncate} ${styles.title}`}>
						{title}
					</div>
					<p className={styles.pTruncate}>{description}</p>
				</div>
				<div
					style={{
						display: 'flex',
						// flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<span style={{ fontSize: '14px', marginTop: '10px' }}>
						Meeting Completed:
					</span>
					<label className={styles.switch}>
						<input
							type='checkbox'
							checked={meetingComplete === true}
							onChange={handleMeetingComplete}
						/>
						<span className={styles.slider}></span>
					</label>
				</div>
				<button
					id={id}
					className={styles.deleteButton}
					onClick={handleDelete}
				>
					X
				</button>
			</div>
			{modal && (
				<div className={styles.overlay}>
					<div className={styles.modalContent}>
						<h1>{title}</h1>
						<hr style={{ width: '80%' }} />
						<p>{description}</p>
						<br />
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<span>Meeting Completed: </span>
							<label className={styles.switchLg}>
								<input
									type='checkbox'
									checked={meetingComplete === true}
									onChange={handleMeetingComplete}
								/>
								<span className={styles.sliderLg}></span>
							</label>
						</div>
						<div style={{ fontSize: '12px' }}>
							<p>Due By: {dateDueByFormatted}</p>
							<p>
								Meeting with {firstUser} & {secondUser}
							</p>
							<p style={{ color: 'lightgray' }}>Created By: {creator}</p>
						</div>
						<div className={styles.countdown}>
							{getTimeRemaining(dateDueBy).days > 0 && (
								<h5>
									{getTimeRemaining(dateDueBy).days} Day(s) before deadline
								</h5>
							)}
							{getTimeRemaining(dateDueBy).days === 0 &&
								getTimeRemaining(dateDueBy).hours > 0 && (
									<h5>
										{getTimeRemaining(dateDueBy).hours} Hour(s) before
										deadline
									</h5>
								)}
							{getTimeRemaining(dateDueBy).days === 0 &&
								getTimeRemaining(dateDueBy).hours === 0 &&
								getTimeRemaining(dateDueBy).minutes > 0 && (
									<h5>
										{getTimeRemaining(dateDueBy).minutes} Minute(s) before
										deadline
									</h5>
								)}
							{getTimeRemaining(dateDueBy).days === 0 &&
								getTimeRemaining(dateDueBy).hours === 0 &&
								getTimeRemaining(dateDueBy).minutes === 0 && (
									<h5 style={{ color: 'red' }}>Deadline has passed</h5>
								)}
						</div>
						<button
							className={styles.deleteButton}
							onClick={handleMeetingModal}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};
