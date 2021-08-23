import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import "../styles/header.css";

import Profil from "./Profil";
import Add from "./addUser";
import Edit from "./editUser";
import Panier from "./Panier";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";
import LogoutButton from "./LogoutButton";
import ShowProducts from "./Products/ShowProducts";
import AddProduct from "./Products/AddProduct";
import ShowOneProduct from "./Products/showOneProduct";
import SearchProduct from "./Products/SearchProduct";
import LogRegisterProfile from "./LogRegisterProfile";
import Commandes from "./Commandes/Commandes";
import DetailsCommandes from "./Commandes/DetailsCommandes";
import logoBan from "../images/Logo Retrowave/Noir/Logotexte/logotexte-retrowave-black-512.png";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";
// import SearchIcon from "@material-ui/icons/Search";

function Header(props) {
  function resetSearch() {
    props.SetSearch(false);
    // while(searching == true){
    // console.log("test click : "+props.search);
    // };
    // console.log(searching);
  }

  var SetSearching = props.SetSearch;
  var searching = props.search;
  var crud = props.crud;
  var setCrud = props.setCrud;

  return (
    <Box>
      <Container max-width="sm">
        <Router>
          <div className="header" style={{ fontFamily: "Roboto, sans-serif" }}>
            <div className="header__top">
              <div className="header__top__logo">
                <Link to="/home">
                  <img src={logoBan} alt="logo retrowave"></img>
                </Link>
              </div>

              <SearchProduct
                SetSearch={SetSearching}
                search={searching}
                crud={crud}
                setCrud={setCrud}
              />

              <div className="header__top__container__menu">
                <p>
                  <LogRegisterProfile />
                </p>
                <div className="header__top__container__menu__bag">
                  <p>
                    <Link to="/panier">
                      <LocalMallOutlinedIcon />
                      <br />
                      Panier
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="header__bottom">
              <nav>
                <ul>
                  <li>
                    <Link to="/home">Home</Link>
                  </li>
                  <li onClick={resetSearch}>
                    <Link to="/products">Products</Link>
                  </li>
                  <li>
                    <Link to="/commandes">Commandes</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <Switch>
            <Route path="/products/:id" component={ShowOneProduct} />
            <Route exact path="/">
              <ShowProducts
                SetSearch={SetSearching}
                search={searching}
                crud={crud}
                setCrud={setCrud}
              />
            </Route>
            <Route path="/home">
              <ShowProducts
                SetSearch={SetSearching}
                search={searching}
                crud={crud}
                setCrud={setCrud}
              />
            </Route>
            <Route path="/products">
              <ShowProducts
                SetSearch={SetSearching}
                search={searching}
                crud={crud}
                setCrud={setCrud}
              />
            </Route>
            <Route path="/Login">
              <FormLogin />
            </Route>
            <Route path="/Register">
              <FormRegister />
            </Route>
            <Route path="/Logout">
              <LogoutButton />
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
            <Route path="/panier">
              <Panier />
            </Route>
            <Route path="/commandes">
              <Commandes />
            </Route>
            <Route path="/commande/:id">
              <DetailsCommandes />
            </Route>
            <Route path="/products/:id" component={ShowOneProduct} />
          </Switch>
        </Router>
      </Container>
    </Box>
  );
}

export default Header;
