import React, { useState, useEffect } from 'react';
import abi from './contract.json';
import './App.css';
const ethers = require("ethers");
const contractAddress = '0x6117D2C08f35371CBdB694215d5bDaa6cf5C6169'; // Replace with the actual contract address

function App() {
  const [connectedContract, setConnectedContract] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [userName, setUserName] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  const connect = async () => {
    if (!provider) {
      console.log("Ethereum provider not available.");
      return;
    }

    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const connectedContract = new ethers.Contract(contractAddress, abi, signer);
    const address = await signer.getAddress();

    setConnectedContract(connectedContract);
    setUserAddress(address);
  };

  const registerUser = async () => {
    if (!connectedContract) {
      console.log("Contract not connected yet.");
      return;
    }

    const tx = await connectedContract.registerUser(userName);
    await tx.wait();
    console.log('User registered:', tx.hash);
  };

  const sendFriendRequest = async () => {
    if (!connectedContract) {
      console.log("Contract not connected yet.");
      return;
    }

    try {
      const tx = await connectedContract.sendFriendRequest(toAddress);
      await tx.wait();
      console.log('Friend request sent:', tx.hash);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async () => {
    if (!connectedContract) {
      console.log("Contract not connected yet.");
      return;
    }

    try {
      const tx = await connectedContract.acceptFriendRequest(fromAddress);
      await tx.wait();
      console.log('Friend request accepted:', tx.hash);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  const fetchUserData = async () => {
    if (!connectedContract) {
      console.log("Contract not connected yet.");
      return;
    }

    try {
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
  
      const userData = await connectedContract.getUserDetails(userAddress);
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div>
      <h2>Connect</h2>
      <button onClick={connect}>Connect</button>
      {userAddress && <p>Connected User Address: {userAddress}</p>}
      <h2>Register</h2>
      <input
        type="text"
        id="username"
        placeholder="Enter username"
        onChange={(e) => setUserName(e.target.value)}
      />
     
      <button onClick={registerUser}>Register User</button>

      <h2>Send Friend Request</h2>
      <input
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        placeholder="Friend's Address"
      />
      <button onClick={sendFriendRequest}>Send Request</button>

      <h2>Accept Friend Request</h2>
      <input
        type="text"
        value={fromAddress}
        onChange={(e) => setFromAddress(e.target.value)}
        placeholder="Friend's Address"
      />
      <button onClick={acceptFriendRequest}>Accept Request</button>
      <button onClick={fetchUserData}>Fetch User Data</button>
      {userData && (
        <div>
          <h2>User Data</h2>
          <p>Name: {userData[0]}</p>
          <p>Friend List: {userData[1].join(', ')}</p>
          <p>Pending Requests: {userData[2].join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;
