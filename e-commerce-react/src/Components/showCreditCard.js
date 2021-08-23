import React from "react";
import { useState, useEffect } from "react";

function ShowCredit() {
  const [cb, setUsers] = useState([]);
  const [button, setButton] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    fetch("https://127.0.0.1:8000/cb", {
      method: "GET",
      headers: {
        Authorization: document.cookie.substring(
          document.cookie.indexOf("/^") + 2,
          document.cookie.indexOf("$/")
        ),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((api) => {
        console.log(api);
        setUsers(
          api.map((cb, i) => {
            return (
              <div id="card" key={i}>
                {cb.numCb} {cb.nomPrenom} {cb.dateExp}
                <button
                  onClick={async (e) => {
                    e.preventDefault();

                    await fetch("http://127.0.0.1:8000/cb/delete/" + cb.id, {
                      method: "DELETE",
                      headers: {
                        Authorization: document.cookie.substring(
                          document.cookie.indexOf("/^") + 2,
                          document.cookie.indexOf("$/")
                        ),
                        "Content-Type": "application/json",
                      },
                    })
                      .then((res) => res.text())
                      .then((data) => {
                        if (change) {
                          setChange(false);
                        } else {
                          setChange(true);
                        }
                      })

                      .catch((err) => console.log(err));
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })
        );
      });
  }, [change]);

  return <div>{cb}</div>;
}

export default ShowCredit;
