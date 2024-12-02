import { useState, useEffect } from "react";
import { ethers } from "ethers";
import counterAbi from "../artifacts/contracts/Assessment.sol/LuisCarCounter.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [counterContract, setCounterContract] = useState(undefined);
  const [counter, setCounter] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const counterABI = counterAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getCounterContract();
  };

  const getCounterContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, counterABI, signer);

    setCounterContract(contract);
  };

  const getCounterValue = async () => {
    if (counterContract) {
      const value = await counterContract.getCounter();
      setCounter(value.toNumber());
    }
  };

  const incrementCounter = async () => {
    if (counterContract) {
      const tx = await counterContract.increment();
      await tx.wait();
      getCounterValue();
    }
  };

  const decrementCounter = async () => {
    if (counterContract) {
      const tx = await counterContract.decrement();
      await tx.wait();
      getCounterValue();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to proceed.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Link Wallet</button>;
    }

    if (counter === undefined) {
      getCounterValue();
    }

    return (
      <div className="counter-container">
        <p>Your Account: {account}</p>
        <p>Number of Cars: {counter}</p>
        <button onClick={incrementCounter}>Car In</button>
        <button onClick={decrementCounter}>Car Out</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Car Tracker 360</h1>
        <p>Overivew</p>
        <ul>
          <li><strong>Car In:</strong> Add cars.</li>
          <li><strong>Car Out:</strong> Remove cars.</li>
        </ul>
        <p>Effortless Car Tracking, Simplified.</p>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: left;
          font-family: Arial, sans-serif;
          margin: 50px;
          background-color: #333;
          color: #fff;
          padding: 20px;
          border-radius: 10px;
        }
        header {
          background-color: #444;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .counter-container {
          background-color: #555;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </main>
  );
}