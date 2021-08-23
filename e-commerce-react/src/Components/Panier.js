import { Box, Container } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../styles/panier.css";
import Paypal from "./Paypal";

function Panier() {
  const [panier, setPanier] = useState([]);
  const [panierNotFound, setPanierNotFound] = useState(false);
  const [montant, setMontant] = useState();
  const [change, setChange] = useState(false);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/detail/commande/panier", {
      headers: {
        Authorization: document.cookie.substring(
          document.cookie.indexOf("/^") + 2,
          document.cookie.indexOf("$/")
        ),
      },
    })
      .then((res) => {
        setLoading(true);
        return res.json();
      })
      .then(async (data) => {
        if (data.Msg === "Panier inexistant") {
          setPanierNotFound(true);
        } else {
          await setProduits(data[0]);
          await setMontant(data[1]);
          await setPanier(
            data[0].map((e, i) => {
              return (
                <tr key={i}>
                  <td>
                    <p>{e[0].title}</p>
                  </td>
                  <td>
                    <div>
                      <button
                        onClick={async () => {
                          let form = new FormData();
                          form.append("id", e[1].id);
                          form.append("quantity", e[1].quantité - 1);
                          fetch(
                            "https://127.0.0.1:8000/detail/commande/panier/edit",
                            {
                              method: "POST",
                              headers: {
                                Authorization: document.cookie.substring(
                                  document.cookie.indexOf("/^") + 2,
                                  document.cookie.indexOf("$/")
                                ),
                              },
                              body: form,
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              if (change) {
                                setChange(false);
                              } else {
                                setChange(true);
                              }
                            });
                        }}
                      >
                        -
                      </button>
                      <p className="quantity">{e[1].quantité}</p>
                      <button
                        onClick={async () => {
                          let form = new FormData();
                          form.append("id", e[1].id);
                          form.append("quantity", e[1].quantité + 1);
                          fetch(
                            "https://127.0.0.1:8000/detail/commande/panier/edit",
                            {
                              method: "POST",
                              headers: {
                                Authorization: document.cookie.substring(
                                  document.cookie.indexOf("/^") + 2,
                                  document.cookie.indexOf("$/")
                                ),
                              },
                              body: form,
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              if (change) {
                                setChange(false);
                              } else {
                                setChange(true);
                              }
                            });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{e[1].prix}€</td>
                  <td>
                    <button
                      onClick={() => {
                        let form = new FormData();
                        form.append("id", e[1].id);
                        form.append("quantity", e[1].quantité + 1);
                        fetch(
                          "https://127.0.0.1:8000/detail/commande/panier/delete",
                          {
                            method: "POST",
                            headers: {
                              Authorization: document.cookie.substring(
                                document.cookie.indexOf("/^") + 2,
                                document.cookie.indexOf("$/")
                              ),
                            },
                            body: form,
                          }
                        )
                          .then((res) => res.text())
                          .then((data) => {
                            if (change) {
                              setChange(false);
                            } else {
                              setChange(true);
                            }
                          });
                      }}
                    >
                      x
                    </button>
                  </td>
                </tr>
              );
            })
          );
        }
        setLoading(false);
      });
    return () => {
      setPanier([]);
    };
  }, [change]);

  const handleSuccess = async () => {
    await fetch("https://127.0.0.1:8000/commande/confirm", {
      method: "POST",
      headers: {
        Authorization: document.cookie.substring(
          document.cookie.indexOf("/^") + 2,
          document.cookie.indexOf("$/")
        ),
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        await setConfirmed(true);
      });
  };

  const getProduits = () => {
    let units = [];
    for (let i = 0; i < produits.length; i++) {
      console.log(produits[i]);
      units[i] = {
        description: produits[i][0].title,
        reference_id: produits[i][0].reference,
        amount: {
          currency_code: "EUR",
          value: produits[i][1].prix,
        },
      };
    }
    return units;
  };

  if (loading) {
    return <div>Loading</div>;
  }

  if (confirmed) {
    return <h3>Votre achat as bien été confirmé!</h3>;
  }

  if (panierNotFound) {
    return <h3>Vous n'avez rien dans votre panier.</h3>;
  }

  return (
    <Box>
      <Container max-width="sm">
        <div style={{ fontFamily: "Roboto, sans-serif" }}>
          <h1>Panier</h1>
          <table>
            <thead>
              <tr>
                <th>
                  <p>Article</p>
                </th>
                <th>
                  <p>Quantité</p>
                </th>
                <th>
                  <p>Prix</p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {panier}
              <tr>
                <td></td>
                <td></td>
                <td>
                  <b>Total: </b> {montant} €
                </td>
              </tr>
            </tbody>
          </table>
          <Paypal getProduits={getProduits} handleSuccess={handleSuccess} />
        </div>
      </Container>
    </Box>
  );
}

export default Panier;
