#!/bin/bash

# Path to the CSV file
csv_file="${PWD}/CSV/ddqn.csv"
source ${PWD}/invoke/invokeDDQNPeer0Org1.sh

tryAgain(){
    echo "Trying again"
    chaincodeInvoke $col1 $col2 $col3 $col4
    if [[ $? -eq 0 ]]; then
        echo "episode $col1 stored in blockchain"
    else
        echo "episode $col1 failed to store in blockchain"
        tryAgain
    fi
}


publishToBlockchain(){

csvtool drop 1 $csv_file | while IFS=, read -r col1 col2 col3 col4
do
    echo "episode : $col1"
    echo "learningRate_0_1 : $col2"
    echo "learningRate_0_0_1 : $col3"
    echo "learningRate_0_0_0_1 : $col4"
    echo "---"
    echo "Publishing to Blockchain"
    chaincodeInvoke $col1 $col2 $col3 $col4
    wait
    if [[ $? -eq 0 ]]; then
        echo "episode $col1 stored in blockchain"
    else
        echo "episode $col1 failed to store in blockchain"
        tryAgain
    fi
    echo -e "Next Episode \n***************"
done
echo "All DQN reward stored in blockchain"
}

publishToBlockchain
