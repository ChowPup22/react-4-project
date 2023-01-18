import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserAuthContext } from '../Context/UserAuth.Context';
import { headerP, paragraph, buttonP, theme } from '../Constants/styles';

export const Home = () => {
	const { currentUserId } = useUserAuthContext();

	useEffect(() => {
		if (currentUserId !== '') {
			window.location.href = '/dashboard';
		}
	}, [currentUserId]);

	return (
		<>
			<h3 style={headerP}>Home</h3>
			<p style={paragraph}>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod
				ipsum reiciendis autem, veritatis illum impedit. Dignissimos vel
				inventore error eos nostrum. Sapiente reiciendis dolorum voluptatum
				nisi culpa quae rerum ullam?
			</p>
			<div
				style={{ display: 'flex', margin: '25px auto', maxWidth: '500px' }}
			>
				<button style={buttonP}>
					<Link
						style={{
							color: theme.colorSText,
							textDecoration: 'none',
							padding: '12px 20px',
						}}
						to='/sign-in'
					>
						Sign In
					</Link>
				</button>
				<button style={buttonP}>
					<Link
						style={{
							color: theme.colorSText,
							textDecoration: 'none',
							padding: '12px 30px',
						}}
						to='/create-account'
					>
						Create Account
					</Link>
				</button>
			</div>
		</>
	);
};
