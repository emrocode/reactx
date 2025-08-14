import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <div className="grid size-full min-h-16 place-items-center border-b border-white/15 text-xs text-white italic after:content-['Header_section']" />
      <Outlet />
      <div className="grid size-full min-h-16 place-items-center border-t border-white/15 text-xs text-white italic after:content-['Footer_section']" />
    </>
  );
};

export default Layout;
