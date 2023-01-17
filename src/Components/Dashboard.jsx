import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buttonS, toastStyle } from '../Constants/styles';
import { TaskBase } from './TaskBase/TaskBase';
import { MeetingBase } from './MeetingBase/MeetingBase';
import { useUserAuthContext } from '../Context/UserAuth.Context';
import { useAPIContext } from '../Context/API.Context';

export const Dashboard = () => {
	const [redirect, setRedirect] = useState(false);
	const [allTasks, setAllTasks] = useState([]);
	const [allMeetings, setAllMeetings] = useState([]);
	const { currentUserId } = useUserAuthContext();
	const { getAllTasks, getAllMeetings } = useAPIContext();

	useEffect(() => {
		if (currentUserId !== null) {
			getAllTasks(currentUserId).then((res) => {
				if (res.data) {
					setAllTasks(res.data);
					return res.toast;
				} else {
					return res.toast;
				}
			});

			getAllMeetings(currentUserId).then((res) => {
				if (res.data) {
					setAllMeetings(res.data);
					return res.toast;
				} else {
					return res.toast;
				}
			});
		} else if (currentUserId === null) {
			toast.error('Please login to view dashboard', toastStyle);
			setTimeout(() => {
				setRedirect(true);
			}, 3000);
		}
	}, [currentUserId, getAllMeetings, getAllTasks]);

	const refetchTasks = () => {
		getAllTasks(currentUserId).then((res) => {
			if (res.data) {
				setAllTasks(res.data);
			} else {
				return res.toast;
			}
		});
	};

	const refetchMeetings = () => {
		getAllMeetings(currentUserId).then((res) => {
			if (res.data) {
				setAllMeetings(res.data);
			} else {
				return res.toast;
			}
		});
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
						style={{
							color: '#fff',
							textDecoration: 'none',
							padding: '12px 20px',
						}}
						to='create-task'
					>
						Create Task
					</Link>
				</button>
				<br />
				<button style={buttonS}>
					<Link
						style={{
							color: '#fff',
							textDecoration: 'none',
							padding: '12px 20px',
						}}
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
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
					marginTop: '75px',
				}}
			>
				<div style={{ marginLeft: '10px' }}>
					<h2>Tasks</h2>
					{allTasks.length > 0
						? allTasks.map((task) => (
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
						  ))
						: null}
				</div>
				<div style={{ marginRight: '10px' }}>
					<h2>Meetings</h2>
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
									userId1={meeting.userId1}
									userId2={meeting.userId2}
									refetchMeetings={refetchMeetings}
								/>
						  ))
						: null}
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: '145px',
					right: '20px',
				}}
			>
				<Link
					style={{
						color: '#fff',
						textDecoration: 'none',
						backgroundColor: '#c44300',
						padding: '3px 5px',
						borderRadius: '5px',
					}}
					to='/'
					reloadDocument={true}
					replace={true}
				>
					Sign Out
				</Link>
			</div>
			<ToastContainer />
		</>
	);
};
