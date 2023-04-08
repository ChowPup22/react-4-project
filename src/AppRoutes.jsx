import { Routes, Route } from 'react-router-dom';
import { brandBorder, brandHeader, brandLogo } from './Constants/styles';
import { images } from './assets/images';
import { lazy, Suspense } from 'react';
import ReactLoading from 'react-loading';

const Home = lazy(() =>
	import('./Components/Home').then((module) => ({ default: module.Home }))
);

const Dashboard = lazy(() =>
	import('./Components/Dashboard').then((module) => ({
		default: module.Dashboard,
	}))
);

const NotFound = lazy(() =>
	import('./Components/NotFound').then((module) => ({
		default: module.NotFound,
	}))
);

const SignIn = lazy(() =>
	import('./Components/SignIn').then((module) => ({
		default: module.SignIn,
	}))
);

const CreateAccount = lazy(() =>
	import('./Components/CreateAccount').then((module) => ({
		default: module.CreateAccount,
	}))
);

const CreateTask = lazy(() =>
	import('./Components/CreateTask/CreateTask').then((module) => ({
		default: module.CreateTask,
	}))
);

const CreateMeeting = lazy(() =>
	import('./Components/CreateMeeting/CreateMeeting').then((module) => ({
		default: module.CreateMeeting,
	}))
);

const AllMeetings = lazy(() =>
	import('./Components/AllMeetings').then((module) => ({
		default: module.AllMeetings,
	}))
);

export const AppRoutes = () => {
	return (
		<>
			<div
				style={{
					background:
						'linear-gradient(350deg, rgb(155, 231, 255), 46%, rgb(34, 134, 195))',
				}}
			>
				<img
					src={images.logo}
					alt='brand logo'
					style={brandLogo}
				/>
				<div style={brandBorder}>
					<h1 style={brandHeader}>Task Hound</h1>
				</div>
			</div>
			<Suspense
				fallback={
					<div style={{ justifyContent: 'center', margin: '0 auto' }}>
						<ReactLoading
							type='bubbles'
							color='#ff7300'
							height={1000}
							width={500}
						/>
					</div>
				}
			>
				<Routes>
					<Route
						path='/'
						element={<Home />}
					/>
					<Route
						path='sign-in'
						element={<SignIn />}
					/>
					<Route
						path='create-account'
						element={<CreateAccount />}
					/>
					<Route path='dashboard'>
						<Route
							index
							element={<Dashboard />}
						/>
						<Route
							path='create-task'
							element={<CreateTask />}
						/>
						<Route
							path='create-meeting'
							element={<CreateMeeting />}
						/>
						<Route
							path='all-meetings'
							element={<AllMeetings />}
						/>
					</Route>

					<Route
						path='*'
						element={<NotFound />}
					/>
				</Routes>
			</Suspense>
		</>
	);
};
