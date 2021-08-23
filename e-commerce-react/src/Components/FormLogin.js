import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

const Form = ({ handleClose }) => {
  const classes = useStyles();
  // create state variables for each input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (isSubmitted) {
    return (
      <div>
        <h2>
          <i>Logged in as </i> {email}
        </h2>
      </div>
    );
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <p style={{ color: "red" }}>{error}</p>
      <TextField
        label="Email"
        variant="filled"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="filled"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <Button variant="contained" onClick={handleClose}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={async (e) => {
            e.preventDefault();

            let formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            await fetch("http://127.0.0.1:8000/auth/login", {
              method: "POST",

              body: formData,
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                if (data.message === "success!") {
                  document.cookie = "token=/^" + data.token + "$/; Secure;";
                  document.cookie = "email=" + email + "; Secure;";
                  setIsSubmitted(true);
                  history.push("/products");
                } else {
                  setError("Wrong credentials. Please Try again");
                }
              });
          }}
        >
          Connexion
        </Button>
      </div>
    </form>
  );
};

export default Form;
