import { createContext, useContext } from 'react';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
	const getAllTasks = async (userId) => {
		const response = await fetch(
			`http://localhost:3022/tasks?userId=${userId}`
		)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to get Tasks');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const getAllMeetings = async () => {
		const result = await fetch(`http://localhost:3022/meetings`)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to get meeting');
				return res.json();
			})
			.catch((err) => console.log(err));

		return result;
	};

	const getAllMeetingResponses = async (userId) => {
		const response = await fetch(
			`http://localhost:3022/meetingResponses?userId=${userId}`
		)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to get Meeting Responses');
				const data = res.json();
				if (data.length) return getAllMeetings(data);
				return;
			})
			.catch((err) => console.log(err));
		return response;
	};

	const postNewMeeting = async (meeting) => {
		const response = await fetch(`http://localhost:3022/meetings`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(meeting),
		})
			.then((res) => {
				if (!res.ok) throw new Error('Failed to create new Meeting');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const postMeetingResponse = async (meetingResponse) => {
		const response = await fetch(
			'http://localhost:3022/meetingResponses',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(meetingResponse),
			}
		)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to post meeting response');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const archiveMeetingResponses = async (meetingId) => {
		const response = await fetch(
			`http://localhost:3022/meetingResponses?meetingId=${meetingId}`
		)
			.then((res) => {
				if (!res.ok)
					throw new Error('Failed to archive Meeting Responses');
				return res.json();
			})
			.catch((err) => console.log(err));
		if (response.length > 0) return response;
		return null;
	};

	const archiveMeeting = async (meeting) => {
		const meetingResponses = await archiveMeetingResponses(meeting.id);
		const response = await fetch(
			'http://localhost:3022/archivedMeetings',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: meeting.title,
					description: meeting.description,
					dateCreated: meeting.dateCreated,
					createdBy: meeting.createdBy,
					dateDueBy: meeting.dateDueBy,
					meetingComplete: meeting.meetingComplete,
					meetingId: meeting.id,
					archivedMeetingResponses: [...meetingResponses],
				}),
			}
		)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to archive meeting');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const deleteMeeting = async (meetingId) => {
		const response = await fetch(
			`http://localhost:3022/meetings/${meetingId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
			.then((res) => {
				archiveMeeting(res.json());
			})
			.then(
				fetch(`http://localhost:3022/meetings/${meetingId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				})
			)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to delete the Meeting');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const updateMeeting = async (id, meeting) => {
		const response = await fetch(`http://localhost:3022/meetings/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ meetingComplete: meeting }),
		})
			.then((res) => {
				if (!res.ok) throw new Error('Failed to update meeting');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const getAllUsers = async () => {
		const response = await fetch('http://localhost:3022/users')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to get all users');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const postNewUser = async (user) => {
		const response = await fetch('http://localhost:3022/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		})
			.then((res) => {
				if (!res.ok) throw new Error('Failed to create User');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const deleteTask = async (taskId) => {
		const response = await fetch(`http://localhost:3022/tasks/${taskId}`, {
			method: 'DELETE',
		})
			.then((res) => {
				if (!res.ok) throw new Error('Failed to delete Task');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const postNewTask = async (task) => {
		const response = await fetch('http://localhost:3022/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(task),
		})
			.then((res) => {
				if (!res.ok) throw new Error('Failed to create new Task');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	const updateTask = async (taskId, taskComplete) => {
		const response = await fetch(`http://localhost:3022/tasks/${taskId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ taskComplete: taskComplete }),
		})
			.then((res) => {
				if (!res.ok) throw new Error('Failed to Update task');
				return res.json();
			})
			.catch((err) => console.log(err));
		return response;
	};

	return (
		<APIContext.Provider
			value={{
				getAllTasks,
				getAllMeetings,
				getAllUsers,
				postNewUser,
				deleteTask,
				postNewTask,
				updateTask,
				postNewMeeting,
				deleteMeeting,
				updateMeeting,
				getAllMeetingResponses,
				postMeetingResponse,
			}}
		>
			{children}
		</APIContext.Provider>
	);
};

export const useAPIContext = () => {
	const context = useContext(APIContext);

	return {
		getAllTasks: context.getAllTasks,
		getAllMeetings: context.getAllMeetings,
		getAllUsers: context.getAllUsers,
		postNewUser: context.postNewUser,
		deleteTask: context.deleteTask,
		postNewTask: context.postNewTask,
		updateTask: context.updateTask,
		postNewMeeting: context.postNewMeeting,
		deleteMeeting: context.deleteMeeting,
		updateMeeting: context.updateMeeting,
		getAllMeetingResponses: context.getAllMeetingResponses,
		postMeetingResponse: context.postMeetingResponse,
	};
};
