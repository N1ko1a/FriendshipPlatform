// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FriendshipPlatform {
    struct User {
        address userAddress;
        string name;
        address[] friendList;
        address[] friendRequests;
    }

    mapping(address => User) public users;

    event NewUserRegistered(address indexed userAddress, string name);
    event FriendRequestSent(address indexed from, address indexed to);
    event FriendRequestAccepted(address indexed from, address indexed to);

    function registerUser(string memory _name) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(users[msg.sender].userAddress == address(0), "User already registered");

        users[msg.sender] = User(msg.sender, _name, new address[](0), new address[](0));
        emit NewUserRegistered(msg.sender, _name);
    }

    function sendFriendRequest(address _to) public {
        require(_to != address(0), "Invalid address");
        require(users[msg.sender].userAddress != address(0), "User not registered");
        require(users[_to].userAddress != address(0), "Recipient not registered");
        require(_to != msg.sender, "Cannot send request to yourself");

        users[_to].friendRequests.push(msg.sender);
        emit FriendRequestSent(msg.sender, _to);
    }

 
function acceptFriendRequest(address _from) public {
    require(_from != address(0), "Invalid address");
    require(users[msg.sender].userAddress != address(0), "User not registered");
    require(users[_from].userAddress != address(0), "Sender not registered");
    require(msg.sender != _from, "Cannot accept request from yourself");

    User storage currentUser = users[msg.sender];
    User storage friendUser = users[_from];

    bool requestFound = false;
    uint256 requestIndex = 0;

    for (uint256 i = 0; i < currentUser.friendRequests.length; i++) {
        if (currentUser.friendRequests[i] == _from) {
            requestFound = true;
            requestIndex = i;
            break;
        }
    }
    if(requestFound == true){
        delete currentUser.friendRequests[requestIndex];
        currentUser.friendRequests[requestIndex] = currentUser.friendRequests[currentUser.friendRequests.length - 1];
        currentUser.friendRequests.pop();
        currentUser.friendList.push(_from);

        friendUser.friendList.push(msg.sender);
        

        emit FriendRequestAccepted(msg.sender, _from);
    }
    else{
        require(requestFound, "No friend request found from the sender");
    }
    
}

 function getUserDetails(address _userAddress) public view returns (string memory, address[] memory, address[] memory) {
        User storage user = users[_userAddress];
        return (user.name, user.friendList, user.friendRequests);
    }
}
