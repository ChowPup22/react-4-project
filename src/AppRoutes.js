import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './Components/Dashboard'
import { Home } from './Components/Home'
import { NotFound } from './Components/NotFound'
import { SignIn } from './Components/SignIn'
import { brandBorder, brandHeader, brandLogo } from './Constants/styles'
import { images } from './assets/images'
import { CreateAccount } from './Components/CreateAccount'
import { CreateTask } from './Components/CreateTask/CreateTask'
import { CreateMeeting } from './Components/CreateMeeting/CreateMeeting'

export const AppRoutes = () => {
  return (
    <>
      <div style={{ background: 'linear-gradient(350deg, rgb(155, 231, 255), 46%, rgb(34, 134, 195))' }}>
        <img src={images.logo} alt="brand logo" style={brandLogo} />
        <div style={brandBorder}>
          <h1 style={brandHeader}>Task Hound</h1>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="create-account" element={<CreateAccount />} />
        <Route path="dashboard">
          <Route index element={<Dashboard />} />
          <Route path="create-task" element={<CreateTask />} />
          <Route path="create-meeting" element={<CreateMeeting />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}