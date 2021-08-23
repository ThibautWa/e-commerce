import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../../styles/commandes.css";

import React, { useEffect, useState } from "react";

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/commande", {
      headers: {
        Authorization: document.cookie.substring(
          document.cookie.indexOf("/^") + 2,
          document.cookie.indexOf("$/")
        ),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCommandes(
          data.map((e, i) => {
            let date = new Date(e.dateEnregistrement).toLocaleDateString();
            if (e.etat === "Panier") {
              return null;
            }
            return (
              <div className="commandesElem" key={i}>
                <p>Montant: {e.montant}€</p>
                <p>Etat: {e.etat}</p>
                <p>Date: {date}</p>
                <Link to={"/commande/" + e.id}>
                  <button className="moreButton">Details</button>
                </Link>
              </div>
            );
          })
        );
      });
    return () => {
      setCommandes([]);
    };
  }, []);

  return (
    <div style={{ fontFamily: "roboto, sans-serif", marginTop: "20px" }}>
      <h1>Etat des commandes:</h1>
      <div
        className="commandes"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          margin: "30px",
        }}
      >
        {commandes}
      </div>
    </div>
  );
}

export default Commandes;
