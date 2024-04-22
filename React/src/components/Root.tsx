import { CssBaseline } from "@mui/joy";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import ResponsiveAppBar from "./Appbar";

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/home");
    }
  }, []);

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      {/* The rest of your application */}
      <ResponsiveAppBar appName="Home game" />
      <Outlet />
    </React.Fragment>
  );
}
