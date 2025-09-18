import { Outlet } from "react-router";
import Placeholder from "./Placeholder";

export default function Layout() {
  return (
    <>
      <Placeholder position="top" title="Header" />
      <Outlet />
      <Placeholder position="bottom" title="Footer" />
    </>
  );
}
