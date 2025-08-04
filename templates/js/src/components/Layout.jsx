import React from "react";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <div className="grid h-16 w-full place-items-center border-b border-white/15 text-xs text-white italic after:content-['Header_section']" />
      <Outlet />
      <div className="grid h-16 w-full place-items-center border-t border-white/15 text-xs text-white italic after:content-['Footer_section']" />
    </>
  );
};

export default Layout;
