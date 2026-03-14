import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import { Toaster } from "react-hot-toast";

function App() {
  const { isSignedIn } = useUser();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/problems"
          element={isSignedIn ? <Problems /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
