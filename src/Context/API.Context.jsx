import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { toastStyle, toastStyle2 } from '../Constants/styles';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
	const getAllTasks = async (userTaskId) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch(
					`http://localhost:3022/tasks?userTaskId=${userTaskId}`
				);
				if (response.ok) {
					const json = await response.json();
					const data = json.map((task) => {
						const {
							id,
							title,
							description,
							userTaskId,
							createdBy,
							dateCreated,
							dateDueBy,
							taskComplete,
						} = task;
						return {
							title,
							description,
							userTaskId,
							createdBy,
							dateCreated,
							dateDueBy,
							taskComplete,
							id,
						};
					});
					return success({
						data,
						toast: toast.success(
							"Tasks Loaded! Let's get busy!",
							toastStyle
						),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle),
				});
			}
		});
	};

	const getAllMeetings = async (userTaskId) => {
		return new Promise(async (success, failure) => {
			try {
				const response1 = await fetch(
					`http://localhost:3022/meetings?userId1=${userTaskId}`
				);
				const response2 = await fetch(
					`http://localhost:3022/meetings?userId2=${userTaskId}`
				);
				if (response1.ok && response2.ok) {
					const json1 = await response1.json();
					const json2 = await response2.json();
					const data1 = json1.map((meeting) => {
						const {
							id,
							title,
							description,
							userId1,
							userId2,
							dateCreated,
							createdBy,
							dateDueBy,
							meetingComplete,
						} = meeting;
						return {
							title,
							description,
							userId1,
							userId2,
							dateCreated,
							createdBy,
							dateDueBy,
							meetingComplete,
							id,
						};
					});
					const data2 = json2.map((meeting) => {
						const {
							id,
							title,
							description,
							userId1,
							userId2,
							dateCreated,
							createdBy,
							dateDueBy,
							meetingComplete,
						} = meeting;
						return {
							title,
							description,
							userId1,
							userId2,
							dateCreated,
							createdBy,
							dateDueBy,
							meetingComplete,
							id,
						};
					});
					return success({
						data: [...data1, ...data2],
						toast: toast.success('Meetings retrieved! ', toastStyle2),
					});
				} else {
					failure(
						new Error(
							`${response1.status}: ${response1.statusText} --- ${response2.status}: ${response2.statusText}`
						),
						toast.error(
							`Server Error:  ${response1.status}~ ${response1.statusText} ${response2.status}~ ${response2.statusText}`,
							toastStyle2
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle2),
				});
			}
		});
	};

	const postNewMeeting = async (meeting) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch(`http://localhost:3022/meetings`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(meeting),
				});
				if (response.ok) {
					const json = await response.json();
					return success({
						data: json,
						toast: toast.success(
							"Meeting created! Let's get motivated! ",
							toastStyle2
						),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle2
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle2),
				});
			}
		});
	};

	const deleteMeeting = async (meetingId) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch(
					`http://localhost:3022/meetings/${meetingId}`,
					{
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				if (response.ok) {
					const json = await response.json();
					return success({
						data: json,
						toast: toast.success('Meeting deleted! ', toastStyle2),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle2
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle2),
				});
			}
		});
	};

	const updateMeeting = async (id, meeting) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch(
					`http://localhost:3022/meetings/${id}`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ meetingComplete: meeting }),
					}
				);
				if (response.ok) {
					const json = await response.json();
					return success({
						data: json,
						toast: toast.success('Meeting updated! ', toastStyle2),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle2
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle2),
				});
			}
		});
	};

	const getAllUsers = async () => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch('http://localhost:3022/users');
				if (response.ok) {
					const json = await response.json();
					const data = json.map((user) => {
						const { id, firstName, lastName, email, meta } = user;
						const { password, userTaskId, dateCreated, isAdmin } = meta;
						return {
							firstName,
							lastName,
							email,
							meta: {
								password,
								userTaskId,
								dateCreated,
								isAdmin,
							},
							id,
						};
					});
					return success({
						data,
						toast: toast.success('Sign in to stay on Task! ', toastStyle),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle),
				});
			}
		});
	};

	const postNewUser = async (user) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch('http://localhost:3022/users', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(user),
				});
				if (response.ok) {
					const json = await response.json();
					return success({
						data: json,
						toast: toast.success(
							'Account created! Welcome to the team! ',
							toastStyle
						),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle),
				});
			}
		});
	};

	const deleteTask = async (taskId) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch(
					`http://localhost:3022/tasks/${taskId}`,
					{
						method: 'DELETE',
					}
				);
				if (response.ok) {
					const json = await response.json();
					return success({
						data: json,
						toast: toast.success('Task Deleted!', toastStyle),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle),
				});
			}
		});
	};

	const postNewTask = async (task) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch('http://localhost:3022/tasks', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(task),
				});
				if (response.ok) {
					const json = await response.json();
					return success({
						data: json,
						toast: toast.success(
							"Task created! Let's get busy! ",
							toastStyle
						),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle),
				});
			}
		});
	};

	const updateTask = async (taskId, taskComplete) => {
		return new Promise(async (success, failure) => {
			try {
				const response = await fetch(
					`http://localhost:3022/tasks/${taskId}`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ taskComplete: taskComplete }),
					}
				);
				if (response.ok) {
					const json = await response.json();
					return success({
						data: json,
						toast: toast.success('Task updated! ', toastStyle),
					});
				} else {
					failure(
						new Error(`${response.status}: ${response.statusText}`),
						toast.error(
							`Server Error:  ${response.status}~ ${response.statusText}`,
							toastStyle
						)
					);
				}
			} catch (err) {
				return failure({
					data: null,
					toast: toast.error(err.message, toastStyle),
				});
			}
		});
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
	};
};
