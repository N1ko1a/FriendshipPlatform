const FriendshipPlatform = artifacts.require("FriendshipPlatform");

contract("FriendshipPlatform", (accounts) => {
  let friendshipPlatformInstance;

  before(async () => {
    friendshipPlatformInstance = await FriendshipPlatform.new();
  });

  it("should register a new user", async () => {
    const name = "Alice";
    await friendshipPlatformInstance.registerUser(name, { from: accounts[0] });

    const userDetails = await friendshipPlatformInstance.getUserDetails(accounts[0]);
    assert.equal(userDetails[0], name, "User name mismatch");
  });

  it("should send a friend request", async () => {
    await friendshipPlatformInstance.registerUser("Bob", { from: accounts[1] });

    await friendshipPlatformInstance.sendFriendRequest(accounts[1], { from: accounts[0] });

    const userDetails = await friendshipPlatformInstance.getUserDetails(accounts[1]);
    assert.equal(userDetails[2].length, 1, "Friend request not received");
  });

  it("should accept a friend request", async () => {

    await friendshipPlatformInstance.acceptFriendRequest(accounts[0], { from: accounts[1] });

    const userDetailsAlice = await friendshipPlatformInstance.getUserDetails(accounts[0]);
    const userDetailsBob = await friendshipPlatformInstance.getUserDetails(accounts[1]);

    assert.equal(userDetailsAlice[1].length, 1, "Friend list not updated for Alice");
    assert.equal(userDetailsBob[1].length, 1, "Friend list not updated for Bob");
  });
});
