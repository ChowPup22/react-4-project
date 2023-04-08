import { UserAuthProvider } from './Context/UserAuth.Context';
import { APIProvider } from './Context/API.Context';
import './App.css';
import { AppRoutes } from './AppRoutes';
import { Suspense } from 'react';
function App() {
  return (
    <APIProvider>
      <UserAuthProvider>
        <Suspense>
          <AppRoutes />
        </Suspense>
      </UserAuthProvider>
    </APIProvider>
  );
}

export default App;
