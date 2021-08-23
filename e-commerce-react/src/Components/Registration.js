import React, { useState, useEffect } from "react";

function Registration() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adress, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {}, []);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleLastname = (e) => {
    setLastname(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleAdress = (e) => {
    setAdress(e.target.value);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  const handlePostalCode = (e) => {
    setPostalCode(e.target.value);
  };

  return (
    <div>
      <h2>Registration</h2>
      <form method="POST">
        <div className="form-item">
          <label htmlFor="name">First Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Insert your firstname..."
            onChange={handleName}
          />
        </div>
        <div className="form-item">
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Insert your lastname..."
            onChange={handleLastname}
          />
        </div>
        <div className="form-item">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Insert your email..."
            onChange={handleEmail}
          />
        </div>
        <div className="form-item">
          <label htmlFor="mdp">Password:</label>
          <input
            type="password"
            name="mdp"
            id="mdp"
            placeholder="Insert your password..."
            onChange={handlePassword}
          />
        </div>
        <div className="form-item">
          <label htmlFor="confirmMdp">Confirm Password:</label>
          <input
            type="password"
            name="confirmMdp"
            id="confirmMdp"
            placeholder="Insert your password again..."
            onChange={handleConfirmPassword}
          />
        </div>
        <div className="form-item">
          <label htmlFor="adress">Adress:</label>
          <input
            type="text"
            name="adress"
            id="adress"
            placeholder="Insert your adress..."
            onChange={handleAdress}
          />
        </div>
        <div className="form-item">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Insert your city..."
            onChange={handleCity}
          />
        </div>
        <div className="form-item">
          <label htmlFor="postal_code">Postal Code:</label>
          <input
            type="text"
            name="postal_code"
            id="postal_code"
            placeholder="Insert your postal code..."
            onChange={handlePostalCode}
          />
        </div>
        <button
          onClick={async (e) => {
            e.preventDefault();

            let res = await fetch("http://127.0.0.1:8000/user/add", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: name,
                lastname: lastname,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                adress: adress,
                city: city,
                postalCode: parseInt(postalCode),
              }),
            });
            console.log(res);

            // let res = await fetch("https://127.0.0.1:8000/users", {method:"GET", mode: "no-cors"});
            // console.log(res);
          }}
        >
          {" "}
          Sign Up{" "}
        </button>
      </form>
    </div>
  );
}

export default Registration;
