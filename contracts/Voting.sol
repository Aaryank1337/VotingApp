// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    address public owner;
    mapping(address => bool) public hasVoted;
    mapping(uint => uint) public voteCounts;

    event Voted(address indexed voter, uint candidateIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function vote(uint candidateIndex) external {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateIndex < 3, "Invalid candidate index");
        
        hasVoted[msg.sender] = true;
        voteCounts[candidateIndex]++;

        emit Voted(msg.sender, candidateIndex);
    }

    function hasVotedCheck(address voter) external view returns (bool) {
        return hasVoted[voter];
    }

    function getVoteCount(uint candidateIndex) external view returns (uint) {
        return voteCounts[candidateIndex];
    }
}
