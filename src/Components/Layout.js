import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";   

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <div className="main-container">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;