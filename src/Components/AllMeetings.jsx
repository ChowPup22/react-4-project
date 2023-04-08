import { Suspense, useState, useEffect, lazy } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { styles } from '../Constants/styles';
import { useAPIContext } from '../Context/API.Context';
import { useUserAuthContext } from '../Context/UserAuth.Context';

const MeetingBase = lazy(() =>
	import('./MeetingBase/MeetingBase').then((module) => ({
		default: module.MeetingBase,
	}))
);

export const AllMeetings = () => {
	const { getAllMeetings } = useAPIContext();
	const { logoutUser } = useUserAuthContext();
	const [redirect, setRedirect] = useState(false);
	const [allMeetings, setAllMeetings] = useState([]);

	useEffect(() => {
		getAllMeetings()
			.then((res) => {
				if (res.length) setAllMeetings(res);
			})
			.catch((err) => console.log(err));
	}, [getAllMeetings]);

	const refetchMeetings = () => {
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
				All Meetings
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
						to='/dashboard/create-task'
					>
						Create Task
					</Link>
				</button>
				<br />
				<button style={styles.buttonS}>
					<Link
						style={styles.link}
						to='/dashboard/create-meeting'
					>
						Create Meeting
					</Link>
				</button>
				<button style={styles.buttonS}>
					<Link
						style={styles.link}
						to='/dashboard'
					>
						View Dashboard
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
				<b>Welcome to the Meeting Dashboard</b> <br /> Browse all meetings.
				Click on one you like to view more details and accept (or reject)
				any meetings you want to! Let's get the most out of your day!
			</div>
			{allMeetings.length > 0 ? (
				<Suspense fallback={<div>Loading...</div>}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							flexWrap: 'wrap',
							marginTop: '25px',
						}}
					>
						{allMeetings.map((meeting) => (
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
					</div>
				</Suspense>
			) : null}
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
