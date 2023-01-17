import { useState, useEffect } from 'react';
import { useAPIContext } from '../../Context/API.Context';
import styles from './TaskBase.module.css';

export const TaskBase = ({
	title,
	description,
	id,
	taskComplete,
	dateDueBy,
	createdBy,
	refetchTasks,
}) => {
	const { deleteTask, updateTask, getAllUsers } = useAPIContext();
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

	useEffect(() => {
		getAllUsers().then((res) => {
			if (res.data) {
				const findUser = res.data.find(
					(user) => user.meta.userTaskId === createdBy
				);
				setCreator(findUser.firstName + ' ' + findUser.lastName);
			}
		});
	}, [createdBy, getAllUsers]);

	useEffect(() => {
		document.addEventListener('keydown', handleModalEventListener);

		return () => {
			document.removeEventListener('keydown', handleModalEventListener);
		};
	}, [handleModalEventListener]);

	const handleDelete = () => {
		deleteTask(id).then((res) => {
			if (res.data) {
				refetchTasks();
				return res.toast;
			} else {
				return res.toast;
			}
		});
	};

	const handleTaskModal = () => {
		if (modal) {
			document.body.classList.remove('activeModal');
			setModal(false);
		} else if (!modal) {
			document.body.classList.add('activeModal');
			setModal(true);
		}
	};

	const handleTaskComplete = () => {
		const updatedTask = !taskComplete;
		updateTask(id, updatedTask).then((res) => {
			if (res.data) {
				refetchTasks();
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
					onClick={handleTaskModal}
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
						Task Completed:
					</span>
					<label className={styles.switch}>
						<input
							type='checkbox'
							checked={taskComplete === true}
							onChange={handleTaskComplete}
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
							<span>Task Completed: </span>
							<label className={styles.switchLg}>
								<input
									type='checkbox'
									checked={taskComplete === true}
									onChange={handleTaskComplete}
								/>
								<span className={styles.sliderLg}></span>
							</label>
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
							onClick={handleTaskModal}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};
