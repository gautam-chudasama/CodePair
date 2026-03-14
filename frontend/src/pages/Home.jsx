import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/react";

const Home = () => {
  return (
      <div>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button>Login</button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <SignOutButton mode="modal" />
        </Show>
        <UserButton />
      </div>
  );
};

export default Home;
