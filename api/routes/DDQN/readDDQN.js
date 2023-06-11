const fs = require("fs");
const path = require("path");
const process = require("process");

const { Gateway, Wallets } = require("fabric-network");

const channelName = "mychannel";
const contractName = "ddqnChaincode";

exports.getAllDDQN = () => {
  return new Promise(async (resolve, reject) => {
    const startUsage = process.cpuUsage();
    const startTime = process.hrtime();
    // Create a new gateway and connect to the network
    try {
      const gateway = new Gateway();
      const walletPath = path.join(__dirname, "..", "..", "org1-wallet");
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
      await contract.evaluateTransaction("DDQNContract:getAllDDQN");
      // TIME
      const endTime = process.hrtime(startTime);
      const elapsedTimeInSeconds = endTime[0] + endTime[1] / 1e9;
      fs.appendFileSync(
        "fetch_ddqn_500.txt",
        "\n" + elapsedTimeInSeconds.toFixed(2)
      );
      gateway.disconnect();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
