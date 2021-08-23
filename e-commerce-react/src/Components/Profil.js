import React, { useState, useEffect } from "react";
import InlineEdit from "./inlineEdit";
import "../styles/profil.css";

var i = 0;

function Profil() {
  const [editableFirstname, setEditableFirstname] = useState("");
  const [editableLastname, setEditableLastname] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editablePostalCode, setEditablePostalCode] = useState("");
  const [editableAddress, setEditableAddress] = useState("");
  const [editableCity, setEditableCity] = useState("");
  const [editablePassword, setEditablePassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://127.0.0.1:8000/user/profile", {
      method: "GET",
      headers: {
        Authorization: document.cookie.substring(
          document.cookie.indexOf("/^") + 2,
          document.cookie.indexOf("$/")
        ),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEditableFirstname(data.name);
        setEditableLastname(data.lastname);
        setEditableEmail(data.email);
        setEditablePostalCode(data.postalCode);
        setEditableAddress(data.adress);
        setEditableCity(data.city);
        setLoading(false);
      });
    return () => {
      setEditableFirstname("");
      setEditableLastname("");
      setEditableEmail("");
      setEditablePostalCode("");
      setEditableAddress("");
      setEditableCity("");
    };
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="Profil">
      <h1 className="profil-head">Profil</h1>
      <div className="content">
        <p style={{ margin: "1em" }} className="label1">
          Prenom :
        </p>
        <p style={{ margin: "1em" }} className="id1">
          <InlineEdit
            text={editableFirstname}
            onSetText={(text) => setEditableFirstname(text)}
            onChange={editProfil(
              editableFirstname,
              editableLastname,
              editableEmail,
              editablePostalCode,
              editableAddress,
              editableCity,
              editablePassword
            )}
          />
        </p>
        <p style={{ margin: "1em" }} className="label2">
          Nom :
        </p>
        <p style={{ margin: "1em" }} className="id2">
          <InlineEdit
            text={editableLastname}
            onSetText={(text) => setEditableLastname(text)}
          />
        </p>
        <p style={{ margin: "1em" }} className="label3">
          Email :
        </p>
        <p style={{ margin: "1em" }} className="id3">
          <InlineEdit
            text={editableEmail}
            onSetText={(text) => setEditableEmail(text)}
          />
        </p>
        {/* <p style={{margin:"1em"}} className="label4">Age :</p>
        <p style={{margin:"1em"}} className="id4">
          <InlineEdit
            text={editableYears}
            onSetText={(text) => setEditableYears(text)}
          />
        </p> */}
        <p style={{ margin: "1em" }} className="label5">
          Code postale :
        </p>
        <p style={{ margin: "1em" }} className="id5">
          <InlineEdit
            text={editablePostalCode}
            onSetText={(text) => setEditablePostalCode(text)}
          />
        </p>
        <p style={{ margin: "1em" }} className="label6">
          Ville :
        </p>
        <p style={{ margin: "1em" }} className="id6">
          <InlineEdit
            text={editableCity}
            onSetText={(text) => setEditableCity(text)}
          />
        </p>
        <p style={{ margin: "1em" }} className="label7">
          adresse :
        </p>
        <p style={{ margin: "1em" }} className="id7">
          <InlineEdit
            text={editableAddress}
            onSetText={(text) => setEditableAddress(text)}
          />
        </p>
        {/* <p style={{margin:"1em"}} className="label8">telephone :</p>
        <p style={{margin:"1em"}} className="id8">
          <InlineEdit
            text={editablePhone}
            onSetText={(text) => setEditablePhone(text)}
          />
        </p> */}
        <p style={{ margin: "1em" }} className="label9">
          mot de passe :
        </p>
        <p style={{ margin: "1em" }} className="id9">
          <InlineEdit
            password={true}
            text={"hidden"}
            onSetText={(text) => setEditablePassword(text)}
          />
        </p>
      </div>
    </div>
  );
}

async function editProfil(
  firstname,
  lastname,
  email,
  postalCode,
  address,
  city,
  password
) {
  if (i > 1) {
    let res = await fetch("https://127.0.0.1:8000/user/update", {
      method: "POST",
      headers: {
        Authorization: document.cookie.substring(
          document.cookie.indexOf("/^") + 2,
          document.cookie.indexOf("$/")
        ),
      },
      body: JSON.stringify({
        name: firstname,
        lastname: lastname,
        email: email,
        adress: address,
        city: city,
        postalCode: parseInt(postalCode),
        password: password,
        confirmPassword: password,
      }),
    });
  }
  i++;
}

export default Profil;
