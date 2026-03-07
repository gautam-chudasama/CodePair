import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/react";

function App() {
  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal" >
            <button>
              Login
            </button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <SignOutButton mode="modal" />
        </Show>
        <UserButton />
      </header>
    </>
  );
}

export default App;
