import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetailsCommandes() {
  const [details, setDetails] = useState("");
  const [id] = useState(useParams().id);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/detail/commande/" + id, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setDetails(
          data.map((e, i) => {
            return (
              <div
                key={i}
                style={{ border: "1px solid black", minWidth: "300px" }}
              >
                <p>
                  <Link
                    style={{ color: "blue" }}
                    onMouseOver={(e) => {
                      e.target.style.color = "cyan";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "blue";
                    }}
                    to={"/products/" + e[0].id}
                  >
                    {e[0].title}
                  </Link>
                </p>
                <p>Quantité : {e[1].quantité}</p>
                <p>Total : {e[1].prix}€</p>
                <p>{e[0].description}</p>
              </div>
            );
          })
        );
      });

    return () => {
      setDetails("");
    };
  }, []);

  return (
    <div
      className="details_commandes"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      {details}
    </div>
  );
}

export default DetailsCommandes;
