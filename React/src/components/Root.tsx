import { CssBaseline } from "@mui/joy";
import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import ResponsiveAppBar from "./Appbar";

export default function Root() {
  const first = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    navigate("/home");
  }, []);

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      {/* The rest of your application */}
      <ResponsiveAppBar appName="Poker Tracker" />
      <Outlet />
    </React.Fragment>
  );
}
