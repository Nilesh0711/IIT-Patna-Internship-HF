const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const process = require("process");
const { deleteFromFabric } = require("./deleteDDQN.js");
const { getAllDDQN } = require("./readDDQN.js");

const { Gateway, Wallets } = require("fabric-network");

const channelName = "mychannel";
const contractName = "ddqnChaincode";

async function sendDataToFabric(data) {
  return new Promise(async (resolve, reject) => {
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
      await contract.submitTransaction(
        "DDQNContract:createDDQN",
        JSON.stringify(data)
      );
      console.log("Data submitted to Fabric:", data);
      gateway.disconnect();
      resolve();
    } catch (error) {
      reject(error);
      // console.error("Failed to submit transaction:", error);
    }
  });
}

async function publishDDQN() {
  for (let index = 1; index <= 1; index++) {
    const startUsage = process.cpuUsage();
    const startTime = process.hrtime();

    const stream = fs.createReadStream("../CSV/ddqn.csv");
    for await (const row of stream.pipe(csv())) {
      const data = {
        episode: row["episode"],
        learningRate_0_1: row["learning_rate_0.1"],
        learningRate_0_0_1: row["learning_rate_0.01"],
        learningRate_0_0_0_1: row["learning_rate_0.001"],
      };
      try {
        await sendDataToFabric(data);
      } catch (error) {
        console.error("Failed to process row:", error);
      }
    }

    // TIME
    const endTime = process.hrtime(startTime);
    const elapsedTimeInSeconds = endTime[0] + endTime[1] / 1e9;
    fs.appendFileSync(
      "attach_ddqn.txt",
      "\n" + elapsedTimeInSeconds.toFixed(2)
    );

    // CPU
    const endUsage = process.cpuUsage(startUsage);
    const cpuUtilization =
      ((endUsage.user + endUsage.system) / (endTime[0] * 1e9 + endTime[1])) *
      100;
    fs.appendFileSync("cpu_ddqn.txt", "\n" + cpuUtilization.toFixed(4));

    // MEM
    const memoryUsage = process.memoryUsage().heapUsed;
    const memoryUtilization = memoryUsage / 1024; // Convert bytes to KB
    fs.appendFileSync("mem_ddqn.txt", "\n" + memoryUtilization.toFixed(2));

    console.log(`Loop number ${index} is completed`);

    // fetchFromFabric
    await getAllDDQN();

    // DeleteFromFabric
    await deleteFromFabric();
  }
}

publishDDQN();
