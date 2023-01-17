/* eslint-disable no-useless-computed-key */
import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserAuthContext } from '../Context/UserAuth.Context';
import { useAPIContext } from '../Context/API.Context';
import { headerP, buttonP, theme, passToggle } from '../Constants/styles';
import { INIT_PASS, INIT_CREATE, visible } from '../Constants/constants';
import InputBase from './InputBase/InputBase';
import { validations } from '../Constants/Validations';

export const CreateAccount = () => {
	const { allUsers, setAllUsers, setCurrentUser, setCurrentUserId } =
		useUserAuthContext();
	const { getAllUsers, postNewUser } = useAPIContext();
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [passConfirm, setPassConfirm] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [passData, setPassData] = useState(INIT_PASS);
	const [inputError, setInputError] = useState({});
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		getAllUsers().then((res) => {
			if (res.data) {
				setAllUsers(res.data);
				return res.toast;
			} else {
				return res.toast;
			}
		});
	}, [getAllUsers, setAllUsers]);

	const handleInputState = {
		email: (value) => setEmail(value),
		pass: (value) => setPass(value),
		passConfirm: (value) => setPassConfirm(value),
		firstName: (value) => setFirstName(value),
		lastName: (value) => setLastName(value),
	};

	const handleValues = {
		email: email,
		pass: pass,
		passConfirm: passConfirm,
		firstName: firstName,
		lastName: lastName,
	};

	const handleInput = ({ target: { name, value } }) => {
		handleInputState[name](value);
	};

	const handleValidations = (type, value) => {
		const validationCreate = {
			...validations,
			passConfirm: (value) =>
				pass === value ? null : 'Passwords do not match',
		};

		const errorText = validationCreate[type](value);
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
			if (!handleValues[val].length) {
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

	const handleCreateAccount = (e) => {
		e.preventDefault();
		const errorCheck = checkErrorBeforeSubmit(handleValues);
		if (!errorCheck) {
			const newUser = {
				firstName,
				lastName,
				email,
				meta: {
					pass,
					userTaskId: crypto.randomUUID(),
					dateCreated: new Date().toJSON(),
					isAdmin: false,
				},
			};
			const userExist = allUsers.find((user) => user.email === email);
			if (userExist) {
				setInputError({
					emailError: 'User already exists',
				});
			} else {
				postNewUser(newUser).then((res) => {
					if (res.data) {
						setCurrentUser(res.data);
						setCurrentUserId(res.data.meta.userTaskId);
						setSubmit(true);
						return res.toast;
					} else {
						return res.toast;
					}
				});
			}
		}
	};

	return (
		<>
			<div>
				<h1 style={headerP}>Create Account</h1>
				<form
					style={{
						margin: '0 auto',
						position: 'relative',
						width: '650px',
					}}
				>
					{INIT_CREATE.map((item) => (
						<InputBase
							header={item.header}
							placeholder={item.label}
							type={item.isPass ? passData.passType : item.type}
							value={handleValues[item.name]}
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
				<div style={{ textAlign: 'center', marginBottom: '20px' }}>
					<button
						style={buttonP}
						type='submit'
						onClick={handleCreateAccount}
					>
						Create Account
					</button>
					{submit && <Navigate to='/dashboard' />}
					<hr style={{ width: '200px', margin: '0 auto' }} />
					<p style={{ marginBottom: '0' }}>or</p>
					<Link
						style={{ color: theme.colorSDark }}
						to='/sign-in'
					>
						Sign In
					</Link>
				</div>
			</div>
			<ToastContainer />
		</>
	);
};
