import { UserAuthProvider } from './Context/UserAuth.Context';
import { APIProvider } from './Context/API.Context';
import './App.css';
import { AppRoutes } from './AppRoutes';
function App() {
  return (
    <APIProvider>
      <UserAuthProvider>
        <AppRoutes />
      </UserAuthProvider>
    </APIProvider>
  );
}

export default App;
