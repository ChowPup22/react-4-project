import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserAuthContext } from '../../Context/UserAuth.Context';
import DateTimePicker from 'react-datetime-picker';
import { toastStyle } from '../../Constants/styles';
import styles from './CreateTask.module.css';
import { useAPIContext } from '../../Context/API.Context';
import { validations } from '../../Constants/Validations';

export const CreateTask = () => {
	const { postNewTask } = useAPIContext();
	const { currentUserId, allUsers, currentUser } = useUserAuthContext();
	const [redirect, setRedirect] = useState(false);
	const [direct, setDirect] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dateDueBy, setDateDueBy] = useState('');
	const [userId, setUserId] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [inputError, setInputError] = useState({});

	useEffect(() => {
		if (currentUserId !== null) {
			if (currentUser.isAdmin === true) {
				setIsAdmin(true);
			} else if (currentUser.isAdmin === false) {
				setIsAdmin(false);
				setUserId(currentUserId);
			}
		} else if (currentUserId === null) {
			toast.error('Please login to create a task', toastStyle);
			setTimeout(() => {
				setRedirect(true);
			}, 3000);
		}
	}, [currentUserId, allUsers, currentUser]);

	const handleInputState = {
		title: (value) => setTitle(value),
		description: (value) => setDescription(value),
		dateDueBy: (value) => setDateDueBy(value),
		userId: (value) => setUserId(value),
	};

	const handleValues = {
		title: title,
		description: description,
		dateDueBy: dateDueBy,
		userId: userId,
	};

	const handleInput = ({ target: { name, value } }) => {
		handleInputState[name](value);
	};

	const handleValidations = (type, value) => {
		const errorText = validations[type](value);
		setInputError((prev) => ({ ...prev, [`${type}Error`]: errorText }));
	};

	const handleBlur = ({ target: { name, value } }) =>
		handleValidations(name, value);

	const checkErrorBeforeSubmit = (inputs) => {
		let errorValue = {};
		let isError = false;
		Object.keys(inputs).forEach((val) => {
			if (!handleValues[val].length) {
				errorValue = { ...errorValue, [`${val}Error`]: 'Required' };
				isError = true;
			} else if (handleValues[val].length) {
				errorValue = { ...errorValue, [`${val}Error`]: '' };
				isError = false;
			}
		});
		setInputError(errorValue);
		return isError;
	};

	const handleCreateTask = async (e) => {
		e.preventDefault();
		const err = checkErrorBeforeSubmit(handleValues);
		if (!err) {
			const task = {
				title,
				description,
				taskComplete: false,
				dateDueBy,
				dateCreated: new Date().toISOString(),
				userId,
				createdBy: currentUserId,
			};

			postNewTask(task).then((res) => {
				if (res) {
					toast.success('Task created!', toastStyle);
					setTimeout(() => {
						setDirect(true);
					}, 3000);
				}
			});
		}
	};

	return (
		<>
			<div>
				<h1 style={{ textAlign: 'center' }}>Create Task</h1>
				<hr style={{ width: '300px', margin: '10px auto' }} />
				<form
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-around',
						flexWrap: 'wrap',
					}}
				>
					<div>
						<label>
							<div className={styles.header}>Title</div>
							<input
								className={styles.input_root}
								name='title'
								value={title}
								onBlur={handleBlur}
								onChange={handleInput}
							/>
							{inputError.titleError && (
								<div className={styles.error}>{inputError.titleError}</div>
							)}
						</label>
						<label>
							<div className={styles.header}>Description</div>
							<textarea
								className={`${styles.input_root} ${styles.textarea}`}
								name='description'
								value={description}
								onChange={handleInput}
								onBlur={handleBlur}
								cols='30'
								rows='5'
							/>
							{inputError.descriptionError && (
								<div className={styles.error}>
									{inputError.descriptionError}
								</div>
							)}
						</label>
					</div>
					<div>
						{isAdmin && (
							<label>
								<div className={styles.header}>Assign To</div>
								<select
									className={styles.input_root}
									name='userId'
									value={userId}
									onBlur={handleBlur}
									onChange={handleInput}
								>
									<option value=''>Select User</option>
									{allUsers.map((user) => (
										<option
											key={user.id}
											value={user.id}
										>
											{user.firstName + ' ' + user.lastName}
										</option>
									))}
								</select>
								{inputError.userIdError && (
									<div className={styles.error}>
										{inputError.userIdError}
									</div>
								)}
							</label>
						)}
						<label>
							<div className={styles.header}>Date Due By: </div>
							<DateTimePicker
								className={styles.input_root}
								disableClock={true}
								onChange={handleInputState.dateDueBy}
								value={dateDueBy}
							/>
						</label>
					</div>
				</form>
				<button
					onClick={handleCreateTask}
					className={styles.buttonP}
				>
					Create Task
				</button>
				<hr style={{ width: '200px', margin: '0 auto' }} />
				<Link
					style={{
						color: '#c44300',
						textDecoration: 'none',
						display: 'block',
						marginTop: '12px',
						textAlign: 'center',
					}}
					to='/dashboard'
				>
					Cancel
				</Link>
			</div>
			{redirect && (
				<Navigate
					to='/'
					replace={true}
				/>
			)}
			{direct && (
				<Navigate
					to='/dashboard'
					replace={true}
				/>
			)}
			<ToastContainer />
		</>
	);
};
