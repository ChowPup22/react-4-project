import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserAuthContext } from '../Context/UserAuth.Context';
import { useAPIContext } from '../Context/API.Context';
import { styles } from '../Constants/styles';

const TaskBase = lazy(() =>
	import('./TaskBase/TaskBase').then((module) => ({
		default: module.TaskBase,
	}))
);

const MeetingBase = lazy(() =>
	import('./MeetingBase/MeetingBase').then((module) => ({
		default: module.MeetingBase,
	}))
);

export const Dashboard = () => {
	const [redirect, setRedirect] = useState(false);
	const [allTasks, setAllTasks] = useState([]);
	const [myResponses, setMyResponses] = useState([]);
	const [allMeetings, setAllMeetings] = useState([]);
	const { currentUserId, currentUser, logoutUser } = useUserAuthContext();
	const { getAllTasks, getAllMeetingResponses, getAllMeetings } =
		useAPIContext();

	const myMeetings = [];

	for (let response of myResponses) {
		for (let meeting of allMeetings) {
			if (response.meetingId === meeting.id) {
				myMeetings.push(meeting);
			}
		}
	}

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));

		if (user) {
			getAllTasks(user.id)
				.then((res) => {
					if (res.length > 0) {
						setAllTasks(res);
					} else {
						return toast.success(
							'Create a task or meeting to get started!',
							styles.toastStyle
						);
					}
				})
				.catch((err) => console.log(err));

			getAllMeetingResponses(user.id)
				.then((res) => {
					if (res.length) setMyResponses(res);
				})
				.catch((err) => console.log(err));

			getAllMeetings()
				.then((res) => {
					if (res.length) setAllMeetings(res);
				})
				.catch((err) => console.log(err));
		} else if (!user) {
			toast.error(
				'Please login or create an account to view dashboard',
				styles.toastStyle
			);
			setTimeout(() => {
				setRedirect(true);
			}, 3000);
		}
	}, [
		currentUser,
		currentUserId,
		getAllMeetingResponses,
		getAllMeetings,
		getAllTasks,
	]);

	const refetchTasks = () => {
		getAllTasks(currentUserId)
			.then((res) => {
				if (res) {
					setAllTasks(res);
				}
			})
			.catch((err) => console.log(err));
	};

	const refetchMeetings = () => {
		getAllMeetingResponses(currentUserId)
			.then((res) => {
				if (res.length) setMyResponses(res);
			})
			.catch((err) => console.log(err));

		getAllMeetings()
			.then((res) => {
				if (res.length) setAllMeetings(res);
			})
			.catch((err) => console.log(err));
	};

	const handleLogout = () => {
		logoutUser();
		setRedirect(true);
	};

	return (
		<>
			<h1
				style={{
					marginLeft: '25px',
					fontWeight: '600',
					fontSize: '2.3rem',
				}}
			>
				Dashboard
			</h1>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					margin: '10px 50px',
					flexWrap: 'wrap',
				}}
			>
				<button style={styles.buttonS}>
					<Link
						style={styles.link}
						to='create-task'
					>
						Create Task
					</Link>
				</button>
				<br />
				<button style={styles.buttonS}>
					<Link
						style={styles.link}
						to='create-meeting'
					>
						Create Meeting
					</Link>
				</button>
				<button style={styles.buttonS}>
					<Link
						style={styles.link}
						to='all-meetings'
					>
						View All Meetings
					</Link>
				</button>
			</div>
			{redirect ? (
				<Navigate
					to='/'
					replace={true}
				/>
			) : null}
			<div style={styles.dashboardMessage}>
				<b>Welcome to the User Dashboard!</b> <br /> Create new tasks and
				meetings or <em>View All Meetings</em> to join an existing meeting!
			</div>
			<div style={styles.dashboardWrap}>
				<div style={{ marginLeft: '10px' }}>
					<h2>Tasks</h2>
					{allTasks.length === 0 ? (
						<div style={styles.messageBox}>
							Your future 'todo' is waiting! <br /> Create a new task above
							to begin
						</div>
					) : null}
					{allTasks.length > 0 ? (
						<Suspense fallback={<div>Loading...</div>}>
							{allTasks.map((task) => (
								<TaskBase
									key={task.id}
									title={task.title}
									description={task.description}
									id={task.id}
									taskComplete={task.taskComplete}
									createdBy={task.createdBy}
									dateDueBy={task.dateDueBy}
									refetchTasks={refetchTasks}
								/>
							))}
						</Suspense>
					) : null}
				</div>
				<div style={{ marginRight: '10px' }}>
					<h2>My Meetings</h2>
					{myMeetings.length === 0 ? (
						<div style={styles.messageBox}>
							Sometimes it's best to do it yourself! <br /> Create a new
							meeting above to begin or browse All Meetings!
						</div>
					) : null}
					{myMeetings.length > 0 ? (
						<Suspense fallback={<div>Loading...</div>}>
							{myMeetings.map((meeting) => (
								<MeetingBase
									key={meeting.id}
									title={meeting.title}
									description={meeting.description}
									id={meeting.id}
									meetingComplete={meeting.meetingComplete}
									createdBy={meeting.createdBy}
									dateDueBy={meeting.dateDueBy}
									refetchMeetings={refetchMeetings}
								/>
							))}
						</Suspense>
					) : null}
				</div>
			</div>
			<div style={styles.logoutWrap}>
				<button
					style={styles.logoutButton}
					onClick={handleLogout}
				>
					Sign Out
				</button>
			</div>
			<ToastContainer />
		</>
	);
};
