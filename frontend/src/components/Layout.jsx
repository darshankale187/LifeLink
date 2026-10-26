import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        Demo project with dummy data only. Real organ allocation is done by doctors and authorities.
      </footer>
    </>
  );
}