import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments";
import "../../styles/showOneProduct.css";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// export default className ShowOneProduct extends Component {
//     render() {
//         return(
//             <div>
//                 <h2>{this.props.match.params.id}</h2>
//             </div>
//         )
//     }
// }

export default ShowOneProduct;
function ShowOneProduct() {
  var id = useParams().id;
  // console.log(id);
  const [crud, setCrud] = useState([]);
  // const [quantity, setQuantity] = useState("");

  var productUrl = "https://127.0.0.1:8000/product/" + id;
  useEffect(() => {
    fetch(productUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((product) => {
        var title = product.title;
        var photo = product.photo;
        var category = product.category;
        var description = product.description;
        var size = product.size;
        var price = product.price;
        var color = product.color;
        // var stock = product.stock;

        // console.log(title);
        // let productUrl = "";
        setCrud(
          <Box>
            <Container max-width="sm">
              <div style={{ fontFamily: "Roboto, sans-serif" }}>
                <div className="product">
                  <div className="partA">
                    <img className="imgProduct" src={photo} alt="produit" />
                  </div>
                  <div className="partB">
                    <div className="category">
                      <h4>
                        categorie {`>`} {category}
                      </h4>
                    </div>
                    <h1 className="title">{title}</h1>
                    <ul>
                      <li className="color">couleur: {color}</li>
                      <li className="size">taille: {size}</li>
                      <li className="size">prix: {price} €</li>
                    </ul>
                    {/* <div className="stock">stock: {stock}</div> */}
                  </div>
                  <div className="partC">
                    <div>
                      <p>Description:</p>
                      <p>{description}</p>
                    </div>
                  </div>
                  <form className="partD">
                    <label htmlFor="quantity"></label>
                    <input
                      className="inputQty"
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      placeholder="1"
                    />
                    <button
                      className="buyButton"
                      onMouseEnter={() => {
                        document.getElementById("quantity").style.borderColor =
                          "rgb(255, 196, 0)";
                      }}
                      onMouseLeave={() => {
                        document.getElementById("quantity").style.borderColor =
                          "gold";
                      }}
                      onClick={async (e) => {
                        e.preventDefault();
                        let form = new FormData();
                        let quantity =
                          document.querySelector("#quantity").value;
                        if (quantity <= 0) {
                          return false;
                        }
                        form.append("quantity", quantity);
                        form.append("id_produit", product.id);
                        fetch("https://127.0.0.1:8000/commande/new", {
                          method: "POST",
                          headers: {
                            Authorization: document.cookie.substring(
                              document.cookie.indexOf("/^") + 2,
                              document.cookie.indexOf("$/")
                            ),
                          },
                          body: form,
                        });
                      }}
                    >
                      Ajouter au panier
                    </button>
                  </form>
                </div>
              </div>
              <Comments product_id={product.id} />
            </Container>
          </Box>
        );
      });
  }, []);
  return <div>{crud}</div>;
}
