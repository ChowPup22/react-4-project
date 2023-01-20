import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskBase } from './TaskBase/TaskBase';
import { MeetingBase } from './MeetingBase/MeetingBase';
import { useUserAuthContext } from '../Context/UserAuth.Context';
import { useAPIContext } from '../Context/API.Context';
import {
	buttonS,
	toastStyle,
	messageBox,
	dashboardMessage,
	logoutButton,
	logoutWrap,
	link,
	dashboardWrap,
} from '../Constants/styles';

export const Dashboard = () => {
	const [redirect, setRedirect] = useState(false);
	const [allTasks, setAllTasks] = useState([]);
	const [allMeetings, setAllMeetings] = useState([]);
	const { currentUserId, currentUser, logoutUser } = useUserAuthContext();
	const { getAllTasks, getAllMeetings } = useAPIContext();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));

		if (user) {
			getAllTasks(user.id).then((res) => {
				if (res.length > 0) {
					setAllTasks(res);
				} else {
					return toast.success(
						'Create a task or meeting to get started!',
						toastStyle
					);
				}
			});

			getAllMeetings().then((res) => {
				if (res) {
					setAllMeetings(res);
				}
			});
		} else if (!user) {
			toast.error(
				'Please login or create an account to view dashboard',
				toastStyle
			);
			setTimeout(() => {
				setRedirect(true);
			}, 3000);
		}
	}, [currentUser, currentUserId, getAllMeetings, getAllTasks]);

	const refetchTasks = () => {
		getAllTasks(currentUserId).then((res) => {
			if (res) {
				setAllTasks(res);
			}
		});
	};

	const refetchMeetings = () => {
		getAllMeetings().then((res) => {
			if (res) {
				setAllMeetings(res);
			}
		});
	};

	const handleLogout = () => {
		logoutUser();
		setRedirect(true);
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					margin: '10px 50px',
				}}
			>
				<h1>Dashboard</h1>
				<button style={buttonS}>
					<Link
						style={link}
						to='create-task'
					>
						Create Task
					</Link>
				</button>
				<br />
				<button style={buttonS}>
					<Link
						style={link}
						to='create-meeting'
					>
						Create Meeting
					</Link>
				</button>
			</div>
			{redirect ? (
				<Navigate
					to='/'
					replace={true}
				/>
			) : null}
			<div style={dashboardMessage}>
				Welcome to the User Dashboard! Join meetings and create new tasks
				or meetings to get the most out of your day!
			</div>
			<div style={dashboardWrap}>
				<div style={{ marginLeft: '10px' }}>
					<h2>Tasks</h2>
					{allTasks.length === 0 ? (
						<div style={messageBox}>
							Your future 'todo' is waiting! <br /> Create a new task above
							to begin
						</div>
					) : null}
					{allTasks.length > 0 ? (
						<>
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
						</>
					) : null}
				</div>
				<div style={{ marginRight: '10px' }}>
					<h2>Meetings</h2>
					{allMeetings.length === 0 ? (
						<div style={messageBox}>
							Sometimes it's best to do it yourself! <br /> Create a new
							meeting above to begin
						</div>
					) : null}
					{allMeetings.length > 0
						? allMeetings.map((meeting) => (
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
						  ))
						: null}
				</div>
			</div>
			<div style={logoutWrap}>
				<button
					style={logoutButton}
					onClick={handleLogout}
				>
					Sign Out
				</button>
			</div>
			<ToastContainer />
		</>
	);
};
