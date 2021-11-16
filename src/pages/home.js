import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

import config from "../lib/config";

toast.configure();

let toasterOption = config.toasterOption;

export default function Home() {
  const [TokenPrice, setTokenPrice] = React.useState(0);
  const [TokenName, setTokenName] = React.useState("");
  const [TokenRoyalities, setTokenRoyalities] = React.useState("");
  const [TokenQuantity, Set_TokenQuantity] = React.useState(1);
  const [TokenDescription, setTokenDescription] = React.useState("");
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState("");

  useEffect(() => {}, []);

  const inputChange = (e) => {
    if (
      e &&
      e.target &&
      typeof e.target.value != "undefined" &&
      e.target.name
    ) {
      var value = e.target.value;
      switch (e.target.name) {
        case "TokenPrice":
          setTokenPrice(value);
          break;
        case "TokenName":
          setTokenName(value);
          break;
        case "TokenQuan":
          setTokenName(value);
          break;
        case "TokenRoyalities":
          setTokenRoyalities(value);
          break;
        case "TokenQuantity":
          Set_TokenQuantity(value);
          break;
        case "TokenDescription":
          setTokenDescription(value);
          break;
        default:
      }
    }
  };


  async function CreateItemValidation() {
    var ValidateError = {};
    if (TokenName == "") {
      ValidateError.TokenName = '"Name" is not allowed to be empty';
    }
    if (TokenRoyalities == "") {
      ValidateError.TokenRoyalities = '"Royalties" is not allowed to be empty';
    }

    if (isNaN(TokenRoyalities) == true) {
      ValidateError.TokenRoyalities = '"Royalties" must be a number';
    } else if (TokenRoyalities < 0) {
      ValidateError.TokenRoyalities = '"Royalties" must be a positive number';
    } 
    if (TokenFilePreUrl == "") {
      ValidateError.TokenFilePreUrl = '"File" is required';
    }
 
   
      if (
        TokenQuantity == "" ||
        (isNaN(TokenQuantity) == true && TokenQuantity == 0)
      ) {
        ValidateError.TokenQuantity = '"Quantity" must be a number';
      }

      if (TokenPrice == "" || (isNaN(TokenPrice) == true && TokenPrice == 0)) {
        ValidateError.TokenPrice = '"Price" must be a number';
      }
     
    

    


    if (
      TokenQuantity == "" ||
      (isNaN(TokenQuantity) == true && TokenQuantity == 0)
    ) {
      ValidateError.TokenQuantity =
        '"Number of copies" must be a positive number';
    }

    return ValidateError;
  }

  async function Createitem(){
    alert("asds")


  }
  const handleFileInput = () => {}


  return (
    <div class="container">
      <div class="row ">
        <div class="col"></div>
        <div class="col">
          <form action="" enctype="multipart/form-data">
            <h1 className="text-center">NFT APP</h1>
            <div class="form-row">
              <div class="form-group ">
                <label for="inputEmail4">Token Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="TokenName"
                  onChange={inputChange}
                  placeholder="TokenName"
                />
              </div>
              <div class="form-group ">
                <label for="inputPassword4">Price</label>
                <input
                  type="number"
                  class="form-control"
                  id="TokenPrice"
                  onChange={inputChange}

                  placeholder="TokenPrice"
                />
              </div>
              <div class="form-group ">
                <label for="inputPassword4">Quantity</label>
                <input
                  type="number"
                  class="form-control"
                  id="TokenQuantity"
                  placeholder="TokenQuantity"
                  onChange={inputChange}

                />
              </div>
              <div class="form-group">
                <label for="inputAddress">Description</label>
                <input
                  type="text"
                  class="form-control"
                  id="TokenDescription"
                  placeholder="TokenDescription"
                  onChange={inputChange}

                />
              </div>
              <div class="form-group">
                <label for="inputAddress">Royalities</label>
                <input
                  type="text"
                  class="form-control"
                  id="TokenRoyalities"
                  placeholder="TokenRoyalities"
                  onChange={inputChange}

                />
              </div>

              <div class="custom-file">
    {/* <input type="file"/> */}

    <input
                      accept="image/*"
                      className="inp_file"
                      type="file"
                      name="collectionpic"
                      id="collectionpic"
                      required="true"
                      // onChange={handleFile}
                    />
    <label class="custom-file-label" for="validatedCustomFile">Choose file...</label>
  </div>
  </div>

            <br />

           
          </form>
          <button type="submit" class="btn btn-primary" onClick={Createitem}>
              Create
            </button>
        </div>
        <div class="col"></div>
      </div>
    </div>
  );
}
