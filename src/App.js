import React, { useState } from "react";
import { ethers } from "ethers";

const AirdropTokenAddress = "0x4Bf0Da3D69925aA8559AD4982C96DF86015e360F";
const ABI = require("./contracts/contract-abi.json");
const I0x0TokenAddress = "0x913C237692621483965964b0618D3e6FBB6aBcEF";
const I0x0TokenABI = require("./contracts/token-abi.json");

function App() {
  const [amount, setAmount] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [connected, setConnected] = useState(window.ethereum.selectedAddress);
  const maxAmount = 10 ** 18;

  const connectAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length === 0) {
      alert("Aborted");
    } else {
      setConnected(true);
    }
  };

  if (!window.ethereum) {
    return `You need to install Metamask`;
  }

  if (!connected) {
    return <button onClick={connectAccount}>Connect Metamask</button>;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const airdropTokenContract = new ethers.Contract(
    AirdropTokenAddress,
    ABI,
    signer
  );

  const validateInput = () => {
    connectAccount();
    if (amount < 1) {
      alert("Invalid amount");
    } else if (amount > maxAmount) {
      alert("You can claim up to 1 token");
    } else {
      claimAirdrop();
    }
  };

  const handleClaim = () => {
    alert(`Successfully claimed ${amount / 10 ** 18} 0x0TT's`);
  };

  const claimAirdrop = async () => {
    try {
      const I0x0Token = await new ethers.Contract(
        I0x0TokenAddress,
        I0x0TokenABI,
        signer
      );
      const tx = await airdropTokenContract.claimAirdrop(
        I0x0TokenAddress,
        amount
      );
      setAmount(0);
      alert("Success! Please wait for transaction to be processed");
      await tx.wait();
      handleClaim();
    } catch (error) {
      alert("Something went wrong :( More details below.");
      setErrorMessage(error.message);
    }
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div>
      <h1>Airdrop Token Claim</h1>
      <p>Enter the amount you want to claim:</p>
      <input
        min={0}
        max={10 ** 18}
        type="number"
        value={amount}
        onChange={handleAmountChange}
      />
      <span>
        {" "}
        = {amount * 10 ** -18} <b>0x0TT</b>
      </span>
      <br />
      <button onClick={validateInput}>Claim</button>
      {errorMessage && <p>Error: {errorMessage}</p>}
    </div>
  );
}

export default App;
