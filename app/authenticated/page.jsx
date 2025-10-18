import { getServerSideProps } from "./authenticatingPage";

export default function PrivatePage({ user }) {
  getServerSideProps();
  return <h1>Hello, {user.email || "user"}!</h1>;
}
