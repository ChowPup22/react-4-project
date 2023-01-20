import { Link } from 'react-router-dom';
import { headerP, paragraph, buttonP, theme } from '../Constants/styles';

export const Home = () => {
	return (
		<>
			<h2 style={headerP}>Home</h2>
			<p style={paragraph}>
				Welcome to <b>Task Hound</b>! Here you can create and manage your
				daily tasks or create meetings with the community. To get started,
				please sign in or create an account.
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
