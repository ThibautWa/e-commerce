import React, { useState } from "react";

export default AddProduct;

function AddProduct() {
  // console.log("hello");
  var selectedFile = null;
  const [UseFile, SetFile] = useState([selectedFile]);

  function onFileChange(event) {
    selectedFile = event.target.files[0];
    SetFile({ selectedFile });
  }
  return (
    <form>
      <label>Article name :</label>
      <br />
      <input type="text" name="name" />
      <br />
      <label>category :</label>
      <br />
      <select>
        <option>Misc</option>
        <option>T-shirt</option>
        <option>Arcade</option>
        <option>Displate</option>
      </select>
      <br />
      <label>size :</label>
      <br />
      <input type="number" name="size" />
      <br />
      <label>color :</label>
      <br />
      <input type="text" name="color" />
      <br />
      <label>description :</label>
      <br />
      <input type="text" name="description" />
      <br />
      <label>price :</label>
      <br />
      <input type="number" name="price" />
      <br />
      <label>photo :</label>
      <br />
      <input type="file" name="photo" onChange={onFileChange} />
      <br />
      <label>stock :</label>
      <br />
      <input type="number" name="stock" />
      <br />
      <input type="submit" value="Envoyer" />
    </form>
  );
}
