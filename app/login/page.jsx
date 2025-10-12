import { login, signup } from "../actions/signActions";

export default function LoginPage() {
  return (
    <main className="bg-white min-h-screen flex flex-col items-center justify-center p-4 text-black">
      <form>
        <div className="container mt-4">
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="container mt-4">
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button
          className="bg-blue-400 rounded-lg py-2 px-4 mt-4 mr-4 text-white "
          formAction={login}
        >
          Log in
        </button>
        <button
          className="bg-green-400 rounded-lg py-2 px-4 mt-4 mr-4 text-white "
          formAction={signup}
        >
          Sign up
        </button>
      </form>
    </main>
  );
}
