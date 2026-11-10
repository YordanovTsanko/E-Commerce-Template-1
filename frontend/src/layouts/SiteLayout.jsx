import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/** Публичен изглед: навигация + съдържание + футър, залепен най-долу. */
const SiteLayout = () => (
  <div className="app-shell">
    <Header />
    <main className="app-main" id="main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default SiteLayout;
