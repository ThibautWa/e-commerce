// import "./App.css";
// import React from "react";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from "react";
// import { makeStyles } from "@material-ui/core";
import Home from "./Home";

function App() {
  const [searching, SetSearching] = useState(false);
  const [crud, setCrud] = useState([]);
  // const [email, setEmail] = useState("");
  // console.log("test App : "+searching);
  return (
    <div className="App">
      <Home
        SetSearch={SetSearching}
        search={searching}
        crud={crud}
        setCrud={setCrud}
      ></Home>
      {/* <h2>Debug</h2> */}
      {/* <Router> */}
      {/* <div> */}
      {/* <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li onClick={resetSearch}>
                <Link to="/products"  >Products</Link>
              </li>
              <li>
                <Link to="/Login">Login</Link>
              </li>
              <li>
                <Link to="/profil">Profil</Link>
              </li>
              <li>
                <Link to="/Register">Register</Link>
              </li>
              <li>
                <Link to="/adduser">AddUser</Link>
              </li>
              <li>
                <Link to="/edituser">EditUser</Link>
              </li>
              <li>
                <Link to="/addproduct">Add Product</Link>
              </li>
              <li>
                <Link to="/creditCard">Add Card</Link>
              </li>
              <li>
              <Link to="/panier">Panier</Link>
              </li>
              <li>
              <Link to="/showcreditcard">Show credit card</Link>
              </li>
              <li>
              <Link to="/paypal">Paypal</Link>
              </li>
            </ul>
          </nav> */}
      {/* <SearchProduct SetSearch = {SetSearching} search = {searching} crud = {crud} setCrud = {setCrud}/> */}

      {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
      {/* <Switch> */}
      {/* <FormLogin></FormLogin>
            <FormRegister></FormRegister> */}
      {/* <Route path="/products/:id" component={ShowOneProduct} />
            <Route path="/products">
              <ShowProducts SetSearch = {SetSearching} search = {searching} crud = {crud} setCrud = {setCrud}/>
            </Route>
            <Route path="/Login">
              <FormLogin />
            </Route>
            <Route path="/Register">
              <FormRegister />
            </Route>
            <Route path="/profil">
              <Profil />
            </Route>
            <Route path="/adduser">
              <Add />
            </Route>
            <Route path="/edituser">
              <Edit />
            </Route>
            <Route path="/addproduct">
              <AddProduct />              
            </Route>
            <Route path="/creditCard">
              <Credit />              
            </Route>
            <Route path="/home">
              <Home></Home>
            </Route>
            <Route path="/panier">
              <Panier></Panier>
            </Route> */}
      {/* </Switch> */}
      {/* </div> */}
      {/* </Router> */}
    </div>
  );
}

export default App;
