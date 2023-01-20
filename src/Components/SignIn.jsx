/* eslint-disable no-useless-computed-key */
import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAPIContext } from '../Context/API.Context';
import { useUserAuthContext } from '../Context/UserAuth.Context';
import {
	headerP,
	buttonP,
	theme,
	passToggle,
	toastStyle,
} from '../Constants/styles';
import { INIT_PASS, INIT_SIGN, visible } from '../Constants/constants';
import InputBase from './InputBase/InputBase';
import { validations } from '../Constants/Validations';

export const SignIn = () => {
	const { allUsers, setAllUsers, registerUser } = useUserAuthContext();
	const { getAllUsers } = useAPIContext();
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [passData, setPassData] = useState(INIT_PASS);
	const [inputError, setInputError] = useState({});
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		getAllUsers().then((res) => {
			if (res) {
				setAllUsers(res);
				toast.success(
					'Welcome back! Sign in to continue or create an account',
					toastStyle
				);
			}
		});
	}, [getAllUsers, setAllUsers]);

	const handleInputState = {
		email: (value) => setEmail(value),
		pass: (value) => setPass(value),
	};

	const handleInput = ({ target: { name, value } }) => {
		handleInputState[name](value);
	};

	const handleValidations = (type, value) => {
		const errorText = validations[type](value);
		setInputError((prev) => ({ ...prev, [`${type}Error`]: errorText }));
	};

	const handleBlur = ({ target: { name, value } }) =>
		handleValidations(name, value);

	const handlePassVisibility = () => {
		if (!passData.passVisible) {
			setPassData({
				passVisible: true,
				passType: 'text',
				passIcon: visible,
			});
		} else if (passData.passVisible) {
			setPassData(INIT_PASS);
		}
	};

	const checkErrorBeforeSubmit = (inputs) => {
		let errorValue = {};
		let isError = false;
		Object.keys(inputs).forEach((val) => {
			if (!val.length) {
				errorValue = { ...errorValue, [`${val}Error`]: 'Required' };
				isError = true;
			} else if (inputError[`${val}Error`]) {
				errorValue = {
					...errorValue,
					[`${val}Error`]: inputError[`${val}Error`],
				};
				isError = true;
			}
		});
		setInputError(errorValue);
		return isError;
	};

	const handleSignIn = (e) => {
		e.preventDefault();
		const errorCheck = checkErrorBeforeSubmit({ email, pass });
		if (!errorCheck) {
			const user = allUsers.find((item) => item.email === email);
			if (user) {
				if (user.password === pass) {
					registerUser(user);
					setSubmit(true);
				} else {
					setInputError((prev) => ({
						...prev,
						passError: 'Incorrect password',
					}));
				}
			} else {
				setInputError((prev) => ({
					...prev,
					emailError: 'Email does not exist',
				}));
			}
		}
	};

	return (
		<>
			<div>
				<h1 style={headerP}>Sign In</h1>
				<form
					style={{
						margin: '0 auto',
						position: 'relative',
						width: '650px',
					}}
				>
					{INIT_SIGN.map((item) => (
						<InputBase
							header={item.header}
							placeholder={item.label}
							type={item.isPass ? passData.passType : item.type}
							value={item.name === 'email' ? email : pass}
							onChange={handleInput}
							autoComplete='off'
							name={item.name}
							key={item.name}
							onBlur={handleBlur}
							errorM={
								inputError &&
								inputError[item.error] &&
								inputError[item.error].length > 1
									? inputError[item.error]
									: null
							}
						/>
					))}
					<span
						style={passToggle}
						onClick={handlePassVisibility}
					>
						{passData.passIcon}
					</span>
				</form>
				<div style={{ textAlign: 'center' }}>
					<button
						style={buttonP}
						type='submit'
						onClick={handleSignIn}
					>
						Sign In
					</button>
					{submit && <Navigate to='/dashboard' />}
					<hr style={{ width: '200px', margin: '0 auto' }} />
					<p style={{ marginBottom: '0' }}>or</p>
					<Link
						style={{ color: theme.colorSDark }}
						to='/create-account'
					>
						Create Account
					</Link>
				</div>
			</div>
			<ToastContainer />
		</>
	);
};
