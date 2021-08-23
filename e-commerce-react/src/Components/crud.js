import React, { useState, useEffect } from "react";
import "./crud.css";

export default Profil;

function Profil() {
  const [crud, setCrud] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((api) => {
        setCrud(
          api.data.map((user, i) => {
            return (
              <div id="crud" key={i}>
                ID: {user.id} PRENOM: {user.name} NOM: {user.lastname} MAIL:{" "}
                {user.email} VILLE: {user.city} CODE POSTAL: {user.postalCode}{" "}
                ADRESSE: {user.adress} STATUT: {user.statut} ROLE: {user.roles}
              </div>
            );
          })
        );
      });
  }, []);

  return <div>{crud}</div>;
}
