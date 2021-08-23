import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export default LogRegisterProfile;

function LogRegisterProfile() {
  const [token, setToken] = useState();

  useEffect(() => {
    async function settoken() {
      // // console.log("test setToken");
      var dc = document.cookie;
      // console.log(dc);
      var prefix = "token=";
      var begin = dc.indexOf("; " + prefix);
      if (begin === -1) {
        begin = dc.indexOf(prefix);
        if (begin !== 0) {
          await setToken("");
        }
      } else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end === -1) {
          end = dc.length;
        }
      }
      await setToken(decodeURI(dc.substring(begin + prefix.length, end)));
      // console.log(token);
    }
    settoken();
  });
  const [logOrProfile, SetLogOrProfile] = useState();
  // var token  = getCookie("token");
  useEffect(() => {
    // console.log("test setLogProfile");
    SetLogOrProfile(() => {
      if (token !== "") {
        return (
          <div className="header__top__container__menu__account logOrRegister">
            <div className="login">
              <Link to="/Profil">
                <AccountCircleIcon />
                <br />
                Profil
              </Link>
            </div>
            <div className="register">
              <Link to="/Logout">
                <ExitToAppIcon />
                <br />
                Logout
              </Link>
            </div>
          </div>
        );
      } else {
        return (
          <div className="logOrRegister">
            <div className="login">
              <Link to="/Login">
                <AccountCircleIcon />
                <br />
                login
              </Link>
            </div>
            <div className="register">
              <Link to="/Register">
                <AccountCircleIcon />
                <br />
                Register
              </Link>
            </div>
          </div>
        );
      }
    });
  }, [token]);
  //    console.log(UseCookie)

  return (
    <div>{logOrProfile}</div>
    // <div className="header__top__container__menu__account">
    //     <AccountCircleIcon />
    //     <p>
    //         <Link to="/Profile">Profil</Link>
    //     </p>
    // </div>
  );
}
