import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import {Link, Button} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {useSnackbar} from "notistack";

const Header = ({page, setForceUpdate}) => {
  const [loggedIn, setLoggedIn] = useState(true);
  const {enqueueSnackbar} = useSnackbar();

  const app = window.location.host.split(".")[0];

  useEffect(() => {
    const userData = localStorage.getItem("warehouseUser");
    if (!userData) {
      setLoggedIn(false);
      return;
    }
    const user = jwtDecode(userData);
    setLoggedIn(user?.name && user?.email);
    if (setForceUpdate) setForceUpdate(prev => prev + 1);
  }, []);

  const handleGoogleSuccess = resp => {
    if (!resp?.credential) {
      console.log("Failed to fetch user token");
      return;
    }
    const user = jwtDecode(resp.credential);

    if (!user.email.endsWith("@electrictheatre.tv")) {
      enqueueSnackbar("Please use your Electric Theatre account", {variant: "error"});
      handleLogout();
      if (setForceUpdate) setForceUpdate(prev => prev + 1);
      return;
    }
    localStorage.setItem("warehouseUser", resp.credential);
    setLoggedIn(true);
    if (setForceUpdate) setForceUpdate(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("warehouseUser");
    googleLogout();
    setLoggedIn(false);
    if (setForceUpdate) setForceUpdate(prev => prev + 1);
  };

  const newPage = page === "issues" ? "Feedback" : "Issues";

  return (
    <div>
      <AppBar position="sticky">
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <a href="/">
              <img src={`/media/${app}/logo_type.png`} className={styles.logo} />
            </a>
          </div>
          <div className={styles.menuContainer}>
            <Link href={"/"} underline="hover" color="inherit" variant="h5">
              Home
            </Link>
            <Link
              href={"http://warehouse.electrictheatre.tv/docs/"}
              underline="hover"
              color="inherit"
              variant="h5"
            >
              Docs
            </Link>
            <Link
              href={`/${newPage.toLowerCase()}`}
              underline="hover"
              color="inherit"
              variant="h5"
            >
              {newPage}
            </Link>
          </div>
          <div className={styles.loginContainer}>
            {/* {!loggedIn && <GoogleLogin
              useOneTap
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />}
            {loggedIn && <Button variant="outlined" onClick={handleLogout}>Logout</Button>} */}
          </div>
        </div>
      </AppBar>
    </div>
  );
};

export default Header;
