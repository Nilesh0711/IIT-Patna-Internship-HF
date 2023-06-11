const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const process = require("process");
const { deleteFromFabric } = require("./deleteDQN.js");
const { getAllDQN } = require("./readDQN.js");

const { Gateway, Wallets } = require("fabric-network");

const channelName = "mychannel";
const contractName = "dqnChaincode";

async function sendDataToFabric(data) {
  // return new Promise(async (resolve, reject) => {
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
        "DQNContract:createDQN",
        JSON.stringify(data)
      );

      // // CPU
      // const endTime2 = performance.now();
      // const endCpuUsage2 = process.cpuUsage(startCpuUsage2);
      // const elapsedTimeMs2 = endTime2 - startTime2;
      // const cpuUtilization2 =
      //   ((endCpuUsage2.user + endCpuUsage2.system) / (elapsedTimeMs2 * 1000)) *
      //   100;
      // fs.appendFileSync("cpu_dqn.txt", "\n" + cpuUtilization2.toFixed(4));

      // // MEM
      // const memoryUsage = process.memoryUsage().heapUsed;
      // const memoryUtilization = memoryUsage / 1024 / 1024; // Convert bytes to KB
      // fs.appendFileSync("mem_dqn.txt", "\n" + memoryUtilization.toFixed(2));


      console.log("Data submitted to Fabric:", data);
      gateway.disconnect();
      // resolve();
    } catch (error) {
      // reject(error);
      console.error("Failed to submit transaction:", error);
    }
  // });
}

async function publishDQN() {
  for (let index = 1; index <= 10; index++) {
    const startUsage = process.cpuUsage();
    const startTime = process.hrtime();
    const startTime2 = performance.now();
    const startCpuUsage2 = process.cpuUsage();

    const stream = fs.createReadStream("../CSV/dqn.csv");
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
      "attach_dqn_500.txt",
      "\n" + elapsedTimeInSeconds.toFixed(2)
    );

    // fetchFromFabric;
    await getAllDQN();

    // DeleteFromFabric;
    await deleteFromFabric();
  }
}

publishDQN();
