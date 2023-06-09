const fs = require("fs");
const { enrollRegisterUser } = require("./prestart/registerUser");
const { enrollAdminOrg1 } = require("./prestart/enrollAdmin-Org1");
const { enrollAdminOrg2 } = require("./prestart/enrollAdmin-Org2");

async function initLedger() {
  try {
    const jsonString = fs.readFileSync(
      "../artifacts/chaincode/DQN/lib/initLedger.json"
    );
    const dqn = JSON.parse(jsonString);
    let i = 0;
    for (i = 0; i < dqn.length; i++) {
      let org = "Org1";
      await enrollRegisterUser(org, dqn[i].episode);
    }
  } catch (err) {
    console.log(err);
  }
}

async function main() {
  await enrollAdminOrg1();
  await enrollAdminOrg2();
  await initLedger();
}

main();
