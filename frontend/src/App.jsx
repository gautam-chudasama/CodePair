import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import ProblemPage from "./pages/ProblemPage";
import SessionPage from "./pages/SessionPage";
import axiosInstance from "./lib/axios";
import { useEffect } from "react";

function AxiosInterceptorSetup({ children }) {
  const { getToken } = useAuth();
  
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getToken]);

  return children;
}

function App() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  
  return (
    <AxiosInterceptorSetup>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <Home /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problems"
          element={isSignedIn ? <Problems /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/session/:id"
          element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster />
    </AxiosInterceptorSetup>
  );
}

export default App;
