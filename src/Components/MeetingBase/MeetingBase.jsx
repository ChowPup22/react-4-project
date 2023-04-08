import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
	const {
		deleteMeeting,
		updateMeeting,
		getAllUsers,
		postMeetingResponse,
		getAllMeetingResponses,
		updateMeetingResponse,
	} = useAPIContext();
	const { currentUserId } = useUserAuthContext();
	const [modal, setModal] = useState(false);
	const [creator, setCreator] = useState('');
	const [meetingResponse, setMeetingResponse] = useState('');
	const [responseFormUI, setResponseFormUI] = useState(false);
	const [responseId, setResponseId] = useState('');
	const dateDueByFormatted = new Date(dateDueBy).toString();

	const getTimeRemaining = (dateDueBy) => {
		const now = Date.parse(new Date());
		const meetingDate = Date.parse(new Date(dateDueBy));
		const total = meetingDate - now;
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
		const days = Math.floor(total / (1000 * 60 * 60 * 24));
		const meetingActiveTime = total + 1000 * 60 * 60;
		const meetingActiveMinutes = Math.floor(
			(meetingActiveTime / 1000 / 60) % 60
		);

		if (days > 0) return <h5>{days} Day(s) before meeting</h5>;
		if (hours > 0) return <h5>{hours} Hour(s) before meeting starts</h5>;
		if (minutes > 0)
			return <h5>{minutes} Minute(s) before meeting starts</h5>;
		if (seconds > 0)
			return <h5>{seconds} Second(s) before meeting starts</h5>;
		if (meetingActiveMinutes > 0)
			return (
				<h5 style={{ color: 'green' }}>
					Meeting Active! {meetingActiveMinutes} minute(s) remaining
				</h5>
			);
		else return <h5 style={{ color: 'red' }}>Meeting has ended</h5>;
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
		updateMeeting(id, true).then(() => {
			refetchMeetings();
		});
	};

	const calcMeetingPast = (date) => {
		const today = new Date();
		const meetingDate = new Date(date);
		return meetingDate <= today;
	};

	useEffect(() => {
		if (calcMeetingPast(dateDueBy) === true && meetingComplete !== true) {
			updateMeetingFinished(id);
		}
	}, [dateDueBy, id, meetingComplete, updateMeetingFinished]);

	useEffect(() => {
		getAllUsers().then((res) => {
			if (res) {
				const findCreator = res.find((user) => user.id === createdBy);
				setCreator(findCreator.firstName + ' ' + findCreator.lastName);
			}
		});
	}, [createdBy, getAllUsers]);

	useEffect(() => {
		getAllMeetingResponses(currentUserId).then((res) => {
			res.forEach((item) => {
				if (item.meetingId === id) {
					setResponseFormUI(true);
					setMeetingResponse(item.response);
					setResponseId(item.id);
				}
			});
		});
	}, [currentUserId, getAllMeetingResponses, id]);

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

	const addResponse = (e) => {
		e.preventDefault();

		const response = {
			meetingId: id,
			userId: currentUserId,
			response: meetingResponse,
		};

		postMeetingResponse(response).then((res) => {
			if (res) {
				setResponseFormUI(true);
				setResponseId(res.id);
			}
		});
	};

	const changeResponse = (e) => {
		e.preventDefault();

		if (meetingResponse === 'accepted') {
			updateMeetingResponse(responseId, 'rejected');
			setMeetingResponse('rejected');
		} else if (meetingResponse === 'rejected') {
			updateMeetingResponse(responseId, 'accepted');
			setMeetingResponse('accepted');
		}
	};

	const handleDelete = () => {
		if (currentUserId === createdBy) {
			deleteMeeting(id);
			refetchMeetings();
		} else {
			toast.error('You must be the creator to delete a meeting', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				progress: undefined,
				theme: 'light',
				toastId: 'custom-id-yes',
			});
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
						justifyContent: 'space-between',
					}}
				>
					<span style={{ fontSize: '14px', marginTop: '10px' }}>
						Meeting Status:{' '}
						{meetingComplete ? <span>Closed</span> : <span>Open</span>}
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
						<h1 style={{ marginTop: '8px' }}>{title}</h1>
						<hr style={{ width: '80%', marginBottom: '0px' }} />
						<p>{description}</p>
						{/* <br /> */}
						<div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
									maxWidth: '300px',
								}}
							>
								<span>
									Meeting Status:{' '}
									{meetingComplete ? (
										<span>Closed</span>
									) : (
										<span>Open</span>
									)}{' '}
								</span>

								<label
									className={styles.switchLg}
									style={{ marginTop: '-3px' }}
								>
									<input
										type='checkbox'
										checked={meetingComplete === true}
										readOnly={true}
									/>
									<span className={styles.sliderLg}></span>
								</label>
							</div>
							{!meetingComplete && !responseFormUI && (
								<div>
									<span>Join the Meeting below! </span>
									<form className={styles.responseForm}>
										<label
											style={{
												borderColor: 'lightgreen',
											}}
											className={styles.responseInput}
										>
											Accept Invite
											<input
												onClick={() => setMeetingResponse('accepted')}
												type='radio'
												id='response-accept'
												name='response'
											></input>
										</label>
										<label
											className={styles.responseInput}
											style={{ borderColor: 'red' }}
										>
											Reject Invite
											<input
												onClick={() => setMeetingResponse('rejected')}
												type='radio'
												id='response-reject'
												name='response'
											></input>
										</label>
									</form>
									<button
										onClick={addResponse}
										className={styles.responseButton}
										style={{ marginLeft: '80px' }}
									>
										Submit
									</button>
								</div>
							)}
							{responseFormUI && (
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<span
										style={{
											color:
												meetingResponse === 'accepted' ? 'green' : 'red',
										}}
									>
										Response Submitted! ({meetingResponse})
									</span>
									<button
										onClick={changeResponse}
										className={styles.responseButton}
									>
										Change Response?
									</button>
								</div>
							)}
						</div>
						<div style={{ fontSize: '12px' }}>
							<p>Start Date: {dateDueByFormatted}</p>
							<p style={{ color: 'lightgray' }}>Created By: {creator}</p>
						</div>
						<div className={styles.countdown}>
							{getTimeRemaining(dateDueBy)}
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
