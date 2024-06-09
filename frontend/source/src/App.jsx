import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import Feedback from "./views/Feedback";
import Issues from "./views/Issues";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import darkScrollbar from "@mui/material/darkScrollbar";
import GlobalStyles from "@mui/material/GlobalStyles";
import {SnackbarProvider} from "notistack";
import {ErrorBoundary} from "react-error-boundary";
import {Button, Typography} from "@mui/material";
import InvalidRoute from "./views/InvalidRoute";
import {GoogleOAuthProvider} from "@react-oauth/google";

const clientId = "472484084658-n3smfn9pdtatn5ptanda0inc7jbbjtgj.apps.googleusercontent.com";

export const colours = {
  main: "rgb(52, 84, 147)",
  dark: "rgb(36, 52, 84)",
  light: "rgb(126, 142, 174)"
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    feedback: {
      main: colours.main
    },
    dark: {
      main: colours.dark
    },
    lightgrey: {
      main: "rgb(200,200,200)",
    },
  },
  typography: {
    allVariants: {
      color: "lightgrey"
    }
  },
});

const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (
    <div className="errorFallback" role="alert">
      <Typography variant="h4">
        Feedback just crashed.
      </Typography>
      <Button variant="contained" size="large" onClick={resetErrorBoundary}>
        Reload
      </Button>
      <pre className="errorContainer">{error.message}</pre>
    </div>
  );
};

const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

export default function App() {
  const handleReceiveUser = user => {
    console.log("RECEIVED USER", user);
  };
  useEffect(() => {
    window.addEventListener("warehouseUser", handleReceiveUser);
    return (
      window.removeEventListener("warehouseUser", handleReceiveUser)
    );
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles styles={{ ...darkScrollbar() }} />
      <div className="App">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
        >
          <GoogleOAuthProvider clientId={clientId}>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/issues" element={<Issues />} />
                  <Route path="/warehouse" element={<Home app="warehouse" />} />
                  {/* <Route path="/" element={<InvalidRoute />} /> */}
                </Routes>
              </Router>
            </SnackbarProvider>
          </GoogleOAuthProvider>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}
