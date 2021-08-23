import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

function Credit() {
  const [num_cb, setNum_cb] = useState("");
  const [date_exp, setDate_exp] = useState("");
  const [nom_prenom, setNom_prenom] = useState("");
  const [focus, setFocus] = useState("");

  useEffect(() => {}, []);

  const handleNum_cb = (e) => {
    setNum_cb(e.target.value);
  };

  const handleDate_exp = (e) => {
    setDate_exp(e.target.value);
  };

  const handleNom_prenom = (e) => {
    setNom_prenom(e.target.value);
  };

  return (
    <div>
      <h2>Credit Card</h2>
      <form method="POST" name="myForm">
        <div className="form-item">
          <label htmlFor="name">Numéro Cb :</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Insert you card number"
            onChange={handleNum_cb}
          />
        </div>
        <div className="form-item">
          <label htmlFor="name">Date d'expiration</label>
          <input type="text" name="name" id="name" onChange={handleDate_exp} />
        </div>
        <div className="form-item">
          <label htmlFor="name">Nom et Prénom</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nom et Prénom"
            onChange={handleNom_prenom}
          />
        </div>
        <button
          onClick={async (e) => {
            e.preventDefault();
            console.log({
              id_users: 1,
              num_cb: num_cb,
              date_exp: date_exp,
              nom_prenom: nom_prenom,
            });
            var formData = new FormData();

            formData.append("num_cb", num_cb);
            formData.append("date_exp", date_exp);
            formData.append("nom_prenom", nom_prenom);
            formData.append("users_id", 1);

            await fetch("https://127.0.0.1:8000/cb/new", {
              method: "POST",
              headers: {
                Authorization: document.cookie.substring(
                  document.cookie.indexOf("/^") + 2,
                  document.cookie.indexOf("$/")
                ),
              },

              body: formData,
            })
              .then((res) => {
                console.log(res);
                return res.json();
              })
              .then((data) => {
                console.log(data);
              });

            // let res = await fetch("https://127.0.0.1:8000/users", {method:"GET", mode: "no-cors"});
            // console.log(res);
          }}
        >
          {" "}
          Add credit card{" "}
        </button>
      </form>

      {/* <Cards
        number={num_cb}
        expiry={date_exp}
        focused={focus}
        name={nom_prenom}
      /> */}
    </div>
  );
}

export default Credit;
