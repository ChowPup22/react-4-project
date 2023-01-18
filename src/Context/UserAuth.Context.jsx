import { createContext, useContext, useState, useEffect } from 'react';
import { useAPIContext } from './API.Context';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
	const [allUsers, setAllUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState({});
	const [currentUserId, setCurrentUserId] = useState('');
	const { postNewUser } = useAPIContext();

	const registerNewUser = (user) => {
		return postNewUser(user).then((user) => {
			localStorage.setItem('user', JSON.stringify(user.data));
			setCurrentUser(user.data);
			setAllUsers([...allUsers, user.data]);
			setCurrentUserId(user.data.meta.userTaskId);
			return user.toast;
		});
	};

	const registerUser = (user) => {
		localStorage.setItem('user', JSON.stringify(user));
		setCurrentUser(user);
		setCurrentUserId(user.meta.userTaskId);
	};

	const logoutUser = () => {
		localStorage.removeItem('user');
		setCurrentUser({});
		setCurrentUserId('');
	};

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user) {
			setCurrentUser(user);
			setCurrentUserId(user.meta.userTaskId);
		}
	}, []);

	return (
		<UserAuthContext.Provider
			value={{
				allUsers,
				setAllUsers,
				currentUser,
				setCurrentUser,
				currentUserId,
				setCurrentUserId,
				registerNewUser,
				registerUser,
				logoutUser,
			}}
		>
			{children}
		</UserAuthContext.Provider>
	);
};

export const useUserAuthContext = () => {
	const context = useContext(UserAuthContext);

	return {
		allUsers: context.allUsers,
		setAllUsers: context.setAllUsers,
		currentUser: context.currentUser,
		setCurrentUser: context.setCurrentUser,
		currentUserId: context.currentUserId,
		setCurrentUserId: context.setCurrentUserId,
		registerNewUser: context.registerNewUser,
		registerUser: context.registerUser,
		logoutUser: context.logoutUser,
	};
};
