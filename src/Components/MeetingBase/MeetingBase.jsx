import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { toastStyle } from '../../Constants/styles';
import { useAPIContext } from '../../Context/API.Context';
import { useUserAuthContext } from '../../Context/UserAuth.Context';
import styles from './MeetingBase.module.css';

export const MeetingBase = ({
	title,
	description,
	id,
	createdBy,
	dateDueBy,
	meetingComplete,
	refetchMeetings,
}) => {
	const { deleteMeeting, updateMeeting, getAllUsers } = useAPIContext();
	const { currentUserId } = useUserAuthContext();
	const [modal, setModal] = useState(false);
	const [creator, setCreator] = useState('');
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

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const updateMeetingFinished = (id) => {
		updateMeeting(id).then(() => {
			refetchMeetings();
		});
	};

	const calcMeetingPast = (date) => {
		const today = new Date();
		const meetingDate = new Date(date);

		return meetingDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0);
	};

	useEffect(() => {
		if (calcMeetingPast(dateDueBy)) {
			updateMeetingFinished(id);
		}
	}, [dateDueBy, id, updateMeetingFinished]);

	useEffect(() => {
		getAllUsers().then((res) => {
			if (res) {
				const findCreator = res.find((user) => user.id === createdBy);
				setCreator(findCreator.firstName + ' ' + findCreator.lastName);
			}
		});
	}, [createdBy, getAllUsers]);

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
		if (currentUserId === createdBy) {
			deleteMeeting(id).then((res) => {
				if (res) {
					refetchMeetings();
				}
			});
		} else {
			toast.error(
				'You must be the creator to delete a meeting',
				toastStyle
			);
		}
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
							readOnly={true}
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
						<div>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<span>Meeting Finished: </span>
								<label className={styles.switchLg}>
									<input
										type='checkbox'
										checked={meetingComplete === true}
										readOnly={true}
									/>
									<span className={styles.sliderLg}></span>
								</label>
							</div>
							<div>
								<span>Interested? </span>
							</div>
						</div>
						<div style={{ fontSize: '12px' }}>
							<p>Due By: {dateDueByFormatted}</p>
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
					<ToastContainer />
				</div>
			)}
		</>
	);
};
