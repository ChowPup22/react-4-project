import { createContext, useContext } from 'react';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
	const getAllTasks = async (userId) => {
		try {
			const res = await fetch(
				`http://localhost:3022/tasks?userId=${userId}`
			);
			if (!res.ok) throw new Error('Failed to get Tasks');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const getAllMeetings = async () => {
		try {
			const res = await fetch(`http://localhost:3022/meetings`);
			if (!res.ok) throw new Error('Failed to get meeting');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	// const getMeetingByResponseId = async (responseIds) => {
	// 	try {
	// 		let meetings = [];
	// 		responseIds.forEach(async (item) => {
	// 			const res = await fetch(
	// 				`http://localhost:3022/meetings/${item.meetingId}`
	// 			);
	// 			if (!res.ok)
	// 				throw new Error(
	// 					`Failed to get meeting! Meeting ID: ${item.meetingId}`
	// 				);
	// 			const data = await res.json();
	// 			meetings.push(data);
	// 		});
	// 		return meetings;
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	const getAllMeetingResponses = async (userId) => {
		try {
			const res = await fetch(
				`http://localhost:3022/meetingResponses?userId=${userId}`
			);

			if (!res.ok) throw new Error('Failed to get Meeting Responses');
			const data = await res.json();
			if (data.length > 0) return data;
			return;
		} catch (err) {
			console.log(err);
		}
	};

	const postNewMeeting = async (meeting) => {
		try {
			const res = await fetch(`http://localhost:3022/meetings`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(meeting),
			});

			if (!res.ok) throw new Error('Failed to create new Meeting');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const postMeetingResponse = async (meetingResponse) => {
		try {
			const res = await fetch('http://localhost:3022/meetingResponses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(meetingResponse),
			});

			if (!res.ok) throw new Error('Failed to post meeting response');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const updateMeetingResponse = async (id, response) => {
		try {
			const res = await fetch(
				`http://localhost:3022/meetingResponses/${id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ response: response }),
				}
			);

			if (!res.ok) throw new Error('Failed to update Meeting Response');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const deleteMeeting = async (meetingId) => {
		try {
			const meeting = await fetch(
				`http://localhost:3022/meetings/${meetingId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (!meeting.ok)
				throw new Error('Failed to Get Meeting for deletion');

			const responses = await fetch(
				`http://localhost:3022/meetingResponses?meetingId=${meetingId}`,
				{
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
				}
			);

			if (!responses.ok)
				throw new Error('Failed to delete meeting responses');

			return {
				meeting: meeting.json(),
				responses: responses.json(),
			};
		} catch (err) {
			console.log(err);
		}
	};

	const updateMeeting = async (id, meeting) => {
		try {
			const res = await fetch(`http://localhost:3022/meetings/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ meetingComplete: meeting }),
			});

			if (!res.ok) throw new Error('Failed to update meeting');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const getAllUsers = async () => {
		try {
			const res = await fetch('http://localhost:3022/users');
			if (!res.ok) throw new Error('Failed to get all users');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const postNewUser = async (user) => {
		try {
			const res = await fetch('http://localhost:3022/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			});

			if (!res.ok) throw new Error('Failed to create User');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const deleteTask = async (taskId) => {
		try {
			const res = await fetch(`http://localhost:3022/tasks/${taskId}`, {
				method: 'DELETE',
			});

			if (!res.ok) throw new Error('Failed to delete Task');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const postNewTask = async (task) => {
		try {
			const res = await fetch('http://localhost:3022/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(task),
			});

			if (!res.ok) throw new Error('Failed to create new Task');
			return res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const updateTask = async (taskId, taskComplete) => {
		try {
			const res = await fetch(`http://localhost:3022/tasks/${taskId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ taskComplete: taskComplete }),
			});

			if (!res.ok) throw new Error('Failed to Update task');
			return res.json();
		} catch (err) {
			console.log(err);
		}
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
				updateMeetingResponse,
				// getMeetingByResponseId,
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
		updateMeetingResponse: context.updateMeetingResponse,
		// getMeetingByResponseId: context.getMeetingByResponseId,
	};
};
