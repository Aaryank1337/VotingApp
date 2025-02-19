import { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xB68e013d55e9a623E04573628f17920638fB24AA"; // Update if deploying to a testnet
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getVoteCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "hasVotedCheck",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "voteCounts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];



const candidates = ["Aaryan", "Dhairyash", "Rushabh", "Aditya"];

export default function VotingApp() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    async function init() {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
  
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
  
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  
        // 🔴 Ensure contract is deployed at this address
        const code = await provider.getCode(CONTRACT_ADDRESS);
        if (code === "0x") {
          console.error("⚠️ Contract not deployed at this address!");
          alert("Contract is not deployed. Please check the address.");
          return;
        }
  
        setContract(contract);
        setAccount(userAddress);
  
        // ✅ Fetch voting status
        const voted = await contract.hasVotedCheck(userAddress);
        setHasVoted(voted);
      } catch (error) {
        console.error("❌ Error connecting to contract:", error);
        alert("Failed to connect to the contract. Check console for details.");
      }
    }
    init();
  }, []);
  

  const vote = async (index) => {
    if (!contract) {
      alert("Contract not initialized!");
      return;
    }

    try {
      const tx = await contract.vote(index);
      await tx.wait();
      setHasVoted(true);
      alert(`✅ Vote cast successfully for ${candidates[index]}!`);
    } catch (error) {
      console.error("❌ Voting error:", error);
      alert("Voting failed. Make sure you haven't already voted.");
    }
  };

 
  return (
    <div className="voting-container">
      <h1>Blockchain Voting System</h1>
      {account ? <p className="connected-account">Connected: {account}</p> : <p className="connected-account text-red">Not connected</p>}
      <div>
        {candidates.map((name, index) => (
          <button 
            key={index} 
            onClick={() => vote(index)}
            disabled={hasVoted}
            className="vote-button"
          >
            Vote for {name}
          </button>
        ))}
      </div>
      {hasVoted && <p className="already-voted">✅ You have already voted!</p>}
    </div>
  );

}
