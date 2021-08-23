import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/user/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: firstName,
        lastname: lastName,
        email: email,
        password: password,
        confirmPassword: password,
        adress: "aze",
        city: "aze",
        postalCode: parseInt(123),
      }),
    }).then((res) => {
      setIsSubmitted(true);
    });
  };

  if (isSubmitted) {
    return (
      <div>
        <h2>
          <i>
            A verification email has been sent to your inbox. Please verify your
            email.
          </i>
        </h2>
      </div>
    );
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        label="Prénom"
        variant="filled"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        label="Nom de famille"
        variant="filled"
        required
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        id="date"
        label="Date de naissance"
        type="date"
        defaultValue="1921-07-20"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={birthdate}
        onChange={(e) => setAge(e.target.value)}
        required
      />
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
        <Button type="submit" variant="contained" color="primary">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default Form;
