import { createContext, useContext, useState } from 'react';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
	const [allUsers, setAllUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState({});
	const [currentUserId, setCurrentUserId] = useState(null);

	return (
		<UserAuthContext.Provider
			value={{
				allUsers,
				setAllUsers,
				currentUser,
				setCurrentUser,
				currentUserId,
				setCurrentUserId,
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
	};
};
