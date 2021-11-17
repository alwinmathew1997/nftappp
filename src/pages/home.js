import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";


import config from "../lib/config";
import { IPFSfileAdd } from "../lib/ipfs";

import Web3 from 'web3';
import '@metamask/legacy-web3'



import TokenAbi from "../Abi/tokenabi.json"
import NFTAbi from "../Abi/nftabi.json"
import MarketAbi from "../Abi/marketabi.json"

toast.configure();

let toasterOption = config.toasterOption;

var web3 = new Web3(window.ethereum);

const TokenAddress = config.tokenaddress;
const NFTAddress = config.nftaddress;
const MarketAddress = config.marketaddress


const TokenContract = new web3.eth.Contract(TokenAbi, TokenAddress)
const NFTContract = new web3.eth.Contract(NFTAbi, NFTAddress)
const MarketContract = new web3.eth.Contract(MarketAbi, MarketAddress)






export default function Home() {
  const [TokenPrice, setTokenPrice] = React.useState(0);
  const [TokenName, setTokenName] = React.useState("");
  const [TokenRoyalities, setTokenRoyalities] = React.useState("");
  const [TokenQuantity, Set_TokenQuantity] = React.useState(0);
  const [TokenDescription, setTokenDescription] = React.useState("");
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState("");
  const [ValidateError, setValidateError] = React.useState({ TokenPrice: '' });
  const [ipfsimg, setIpfsImg] = useState(null)
  const [UserAccountAddr, setUserAccountAddr] = React.useState('');
  const [WalletConnected, setWalletConnected] = React.useState(false);
  const [TokenFile, setTokenFile] = React.useState("");
  const [ipfsmetadata, setipfsmetadata] = React.useState("");
  const [TokenFilePreReader, setTokenFilePreReader] = React.useState("");
  const [Accounts, Set_Accounts] = React.useState('');
  const [UserAccountBal, setUserAccountBal] = React.useState(0);
  const [userNFTS, setuserNFTS] = React.useState([]);

  useEffect(() => {
    ConnectWallet()
  }, []);


  const inputChange = (e) => {
    if (
      e &&
      e.target &&
      typeof e.target.value != "undefined" &&
      e.target.id
    ) {
      var value = e.target.value;
      switch (e.target.id) {
        case "TokenPrice":
          setTokenPrice(value);
          break;
        case "TokenName":
          setTokenName(value);
          break;
        case "TokenQuantity":
          Set_TokenQuantity(value);
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
    if (TokenDescription == "") {
      ValidateError.TokenDescription = '"TokenDescription" is not allowed to be empty';
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


    setValidateError(ValidateError);


    return ValidateError;
  }

  async function Createitem() {
    var errors = await CreateItemValidation();
    var errorsSize = Object.keys(errors).length;

    if (errorsSize != 0) {
      toast.error("Form validation error. Fix all mistakes and submit again", toasterOption);
    }
    else {

      var ipfshash = await IPFSfileAdd(ipfsimg)
      if (ipfshash) {

        var metadata = {
          Name: TokenName,
          Royalities: TokenRoyalities,
          Image: config.ipfsurl + ipfshash,
          Quantity: TokenQuantity,
          Price: TokenPrice,
          Description: TokenDescription
        }

        var metbuffer = Buffer.from(JSON.stringify(metadata))

        var ipfsmetadata = await IPFSfileAdd(metbuffer)

        if (ipfsmetadata) {
          if (window.ethereum) {
            if (typeof window.web3 == 'undefined' || typeof window.web3.eth == 'undefined') {
              toast.error("Please Connect ", toasterOption)
            }
            else {
              var result = await NFTContract.methods.mint(
                TokenQuantity,
                TokenRoyalities,
                config.ipfsurl + ipfsmetadata
              ).send({
                from: Accounts
              })

              console.log("resultresult", result)
              var tokenId = (result && result.events && result.events.Mint
                && result.events.Mint.returnValues && result.events.Mint.returnValues[0]) ? parseFloat(result.events.Mint.returnValues[0]) : 0

              var tokendata = localStorage.getItem("TokenDetails");
              if (tokendata == null) { tokendata = {}; } else {
                tokendata = JSON.parse(tokendata)
              }
              if (typeof tokendata[Accounts] == 'undefined') { tokendata[Accounts] = []; }
              tokendata[Accounts].push(tokenId);
              localStorage.setItem("TokenDetails", JSON.stringify(tokendata));


            }
          }
        }
      }
    }
  }



  const handleFileInput = async (e) => {
    let imageFormat = /\.(png|gif|webp|mp4|mp3)$/;
    if (e.target.files[0].size > 30000000) {
      setValidateError({ TokenFilePreUrl: "Image must be lesser than 30 MB" });
    }
    else if (!imageFormat.test(e.target.files[0].name)) {
      setValidateError({ TokenFilePreUrl: "Image must be select  PNG,GIF,WEBP,MP4 OR MP3" });
    }
    else {
      if (e.target && e.target.files) {
        setValidateError("")
        var reader = new FileReader()
        var reader1 = new FileReader()

        var file = e.target.files[0];
        setTokenFile(file);
        reader1.readAsArrayBuffer(file)
        reader1.onloadend = function (e) {
          setIpfsImg(Buffer(reader1.result))
        }

        var url = reader.readAsDataURL(file);

        reader.onloadend = function (e) {
          if (reader.result) {
            setTokenFilePreReader(reader.result);
          }
        }.bind(this);
        setTokenFilePreUrl(e.target.value);
      }
    }
  }

  async function ConnectWallet() {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      try {
        if (typeof web3 !== 'undefined') {
          await window.ethereum.enable()
            .then(async function () {
              const web3 = new Web3(window.web3.currentProvider)
              if (window.web3.currentProvider.networkVersion == config.networkVersion) {
                if (window.web3.currentProvider.isMetaMask === true) {
                  if (window.web3 && window.web3.eth && window.web3.eth.defaultAccount) {
                    var currAddr = window.web3.eth.defaultAccount;
                    setUserAccountAddr(currAddr);
                    setWalletConnected(true);
                    var result = await web3.eth.getAccounts()
                    var setacc = result[0];
                    Set_Accounts(setacc);
                    GetNFTdata(setacc)
                    web3.eth.getBalance(setacc)
                      .then(val => {
                        var balance = val / config.decimalvalues;
                        setUserAccountBal(balance);
                      })
                  }
                }
              } else {
                setWalletConnected(false);
                toast.warning("Please Add Metamask External", toasterOption)
              }
            })
            .catch((e) => {
            })
        } else {
          setWalletConnected(false);
          toast.warning("Please Add Metamask External", toasterOption)
        }
      } catch (err) {
        setWalletConnected(false);
      }
    }
    else {
      setWalletConnected(false);
      toast.warning("Please Add Metamask External", toasterOption)
    }
  }

  async function GetNFTdata(address) {
    var tokendata = localStorage.getItem("TokenDetails");

    if (tokendata != null) {
      tokendata = JSON.parse(tokendata)
      var usernfts = tokendata[address]
      // console.log("usernftsusernfts", usernfts)

      var temparra = []

      // var newobj={}

      for (var i = 0; i < usernfts.length; i++) {
        var ipfsurl = await NFTContract.methods.uri(usernfts[0]).call()

        await fetch(ipfsurl)
          .then(async (response) => response.json())
          .then(async data => {
            temparra.push(data)

          });

      }
    }
  }


  return (
    <div class="container">
      <div class="row ">
        <div class="col"></div>
        <div class="col">
          <form action="" enctype="multipart/form-data">
            <h1 className="text-center">NFT

            </h1>
            {WalletConnected ? (
              <>
                <p className="text-center">Connected Address  {UserAccountAddr}</p>
                <p className="text-center">{UserAccountBal} ETH</p>
              </>
            ) : (
              <button type="submit" class="btn btn-primary" onClick={ConnectWallet}>
                Connect Wallet
              </button>
            )}


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
                {ValidateError.TokenName && <span className="text-danger">{ValidateError.TokenName}</span>}

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
                {ValidateError.TokenPrice && <span className="text-danger">{ValidateError.TokenPrice}</span>}

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
                {ValidateError.TokenQuantity && <span className="text-danger">{ValidateError.TokenQuantity}</span>}
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
                {ValidateError.TokenDescription && <span className="text-danger">{ValidateError.TokenDescription}</span>}
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
                {ValidateError.TokenRoyalities && <span className="text-danger">{ValidateError.TokenRoyalities}</span>}
              </div>
              <br />
              <div class="custom-file">

                <input
                  accept="image/*"
                  className="inp_file"
                  type="file"
                  name="image"
                  id="image"
                  required="true"
                  name="image"
                  onChange={handleFileInput}
                />

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
