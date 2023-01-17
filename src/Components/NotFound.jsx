import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastStyle } from '../Constants/styles';

export const NotFound = () => {
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigate('/', { replace: true });
		}, 4000);
	}, [navigate]);
	toast.error('Page not found; Redirecting to Home', toastStyle);

	return (
		<>
			<div style={{ marginTop: '200px', textAlign: 'center' }}>
				<br />
				<h1>404</h1>
				<h1 style={{ color: 'red' }}>Not Found</h1>
				<br />
			</div>
			<ToastContainer />
		</>
	);
};
