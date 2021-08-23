import React, { useEffect } from "react";
import "../../styles/showproducts.css";
import Container from "@material-ui/core/Container";

export default ShowProducts;

function ShowProducts(props) {
  // var search = props.search;
  // console.log("test show product "+props.search);
  // console.log(props.search);
  useEffect(() => {
    // console.log("test useffect ");
    fetch("https://127.0.0.1:8000/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((api) => {
        // console.log(api);
        // let productUrl = "";
        if (props.search === false) {
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
        }
      });
    // .then(()=>{console.log("teeeest")})
  }, [props.search]);
  var crud = props.crud;
  // console.log(crud);
  // if(props.search == false){
  //   console.log("test url 1")
  //   return (
  //     <div>
  //       <h1>Products</h1>
  //       {crud}
  //     </div>
  //   );
  // }else{
  //   console.log("test url 2")
  //   return(
  //     ""
  //   )
  // }
  return (
    <div className="container__produits">
      <Container max-width="sm">
        <h1 style={{ fontFamily: "Roboto, sans-serif" }}>Produits</h1>
        <div className="produits">{crud}</div>
      </Container>
    </div>
  );
  // return
}
