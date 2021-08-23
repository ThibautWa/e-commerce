import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React from "react";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import ShowProducts from "./Components/Products/ShowProducts";

function Home(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "red",
    },
    cardProduit: {
      backgroundColor: "green",
      textAlign: "center",
    },
  }));
  var SetSearching = props.SetSearch;
  var searching = props.search;
  var crud = props.crud;
  var setCrud = props.setCrud;

  const classes = useStyles();

  return (
    <Box>
      <Container>
        <Header
          SetSearch={SetSearching}
          search={searching}
          crud={crud}
          setCrud={setCrud}
        ></Header>
        <Footer></Footer>
      </Container>
    </Box>
  );
}

export default Home;
