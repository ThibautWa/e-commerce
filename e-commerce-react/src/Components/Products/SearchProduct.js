import React, { useState } from "react";
import "../../styles/header.css";
import { useHistory } from "react-router-dom";

import SearchIcon from "@material-ui/icons/Search";

export default SearchProduct;

function SearchProduct(props) {
  const [useValue, setValue] = useState([]);
  const history = useHistory();

  // console.log(window.location.href);

  const routeChange = (e) => {
    e.preventDefault();
    let path = `/products`;
    history.push(path);
    submitSearch();
    // props.SetSearch(false);
  };
  function changeValue(e) {
    setValue(e.target.value);
  }
  // const [crud, setCrud] = useState([]);
  function submitSearch() {
    // console.log(useValue);
    if (useValue !== "") {
      props.SetSearch(true);
      // console.log(props.search);
      var formdata = new FormData();
      formdata.append("title", useValue);
      fetch("http://127.0.0.1:8000/product/search", {
        method: "POST",
        body: formdata,
      })
        // .then((res) => console.log(res))
        .then((res) => res.json())
        // .then(product => console.log(product))
        .then((api) => {
          // console.log(api);
          props.setCrud(
            api.map((product, i) => {
              // console.log(product.id)
              var productUrl = "products/" + product.id;
              return (
                <a
                  href={productUrl}
                  id="crud"
                  className="produit"
                  key={i}
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  <div
                    className="produitImage"
                    style={{ backgroundImage: `url(${product.photo})` }}
                  >
                    <h2>
                      <a className="produitTitle" href={productUrl}>
                        {product.title}
                      </a>
                    </h2>
                  </div>
                  {/* <div className="produitCategorie">
                  category: {product.category}                  
                </div> */}
                  <div className="produitDescription">
                    {product.description}
                  </div>
                  {/* <div className="produitColor">
                  color: {product.color}
                </div>
                <div className="produitTaille">
                  size: {product.size}                  
                </div> */}
                  <div className="produitPrix">{product.price}€</div>
                  {/* <div className="produitStock">
                  stock: {product.stock}
                </div> */}
                  <div>
                    <a href={productUrl}>
                      <button className="produitButton">Acheter</button>
                    </a>
                  </div>
                </a>
              );
            })
          );
        }, []);
      var crud = props.crud;
      return { crud };
    } else {
      props.SetSearch(false);
      // console.log("test else : "+props.search);
    }
  }
  //
  return (
    <div>
      <form
        onSubmit={submitSearch}
        action="http://localhost:3000/products"
        className="header__top__form"
      >
        <input
          type="text"
          id="searchbarProduct"
          name="searchbarProduct"
          placeholder="recherche..."
          value={useValue}
          onChange={changeValue}
        />
        <button type="submit" onClick={routeChange}>
          <SearchIcon />
        </button>
      </form>
    </div>
  );
}
