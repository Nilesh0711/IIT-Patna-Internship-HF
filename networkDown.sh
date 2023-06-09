echo
echo "**************************************************************"
echo "########   Network Down    #############"
echo "**************************************************************"
echo
echo
echo "**************************************************************"
echo "Removing All docker containers"
echo "**************************************************************"
echo
docker rm -vf $(docker ps -aq)
sleep 1

cd ${PWD}/channel-artifacts/
sudo rm -rf mychannel.block

cd ../artifacts/channel/

echo
echo "**************************************************************"
echo "Removing crypto-config genesis mychannel and anchors"
echo "**************************************************************"
echo

sudo rm -rf crypto-config/
sudo rm -rf genesis.block
sudo rm -rf mychannel.tx
sudo rm -rf Org1MSPanchors.tx
sudo rm -rf Org2MSPanchors.tx

cd create-certificate-with-ca
sleep 2
echo
echo "**************************************************************"
echo "Removing fabric ca"
echo "**************************************************************"
echo
sudo rm -rf fabric-ca/
sleep 2


echo
echo "**************************************************************"
echo "Removing wallet and connection profile"
echo "**************************************************************"
echo

cd ../../../api/
sudo rm -rf org1-wallet/
sudo rm -rf org2-wallet/
cd config/
sudo rm -rf connection-org1.json
sudo rm -rf connection-org2.json
sleep 2

echo
echo "**************************************************************"
echo "Removing tar file and log.txt"
echo "**************************************************************"
echo

cd ../../
sudo rm -rf ddqnChaincode.tar.gz
sudo rm -rf dqnChaincode.tar.gz
sudo rm -rf log.txt



echo
echo "**************************************************************"
echo "########   Network Down   #############"
echo "**************************************************************"
echo


