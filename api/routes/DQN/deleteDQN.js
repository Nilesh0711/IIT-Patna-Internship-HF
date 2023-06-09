const fs = require("fs");
const path = require("path");

const { Gateway, Wallets } = require("fabric-network");

const channelName = "mychannel";
const contractName = "dqnChaincode";

exports.deleteFromFabric = async () => {
  return new Promise(async (resolve, reject) => {
    // Create a new gateway and connect to the network
    try {
      const gateway = new Gateway();
      const walletPath = path.join(__dirname, "..","..", "org1-wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      const connectionProfilePath = path.join(
        __dirname,
        "..",
        "..",
        "config",
        "connection-org1.json"
      );
      const connectionOptions = {
        wallet,
        identity: "0", // The identity to be used for submitting the transaction
        discovery: { enabled: true, asLocalhost: true }, // Enable discovery and use the local gateway
      };

      const connectionProfile = JSON.parse(
        fs.readFileSync(connectionProfilePath, "utf8")
      );
      await gateway.connect(connectionProfile, connectionOptions);
      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(contractName);
      await contract.submitTransaction(
        "DQNContract:deleteAllData"
      );
      console.log("Data removed");
      gateway.disconnect();
    } catch (error) {
      console.error("Failed to submit transaction:", error);
      reject()
    }
    resolve()
    return true;
  });
}