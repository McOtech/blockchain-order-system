#!/usr/bin/env bash

source ./scripts/config.conf

echo "==========================================================="
echo "------------ Deleting Contract Account Set -------------"
echo "==========================================================="

near delete $CONTRACT_NAME $BENEFICIARY_ACCOUNT_ID

echo "============================================================"
echo "---------- Deleting Contract Account Credentials ----------"
echo "============================================================"

rm $CREDENTIALS_ROOT_DIR/$CONTRACT_NAME.json

echo "============================================================"
echo "-------------------- Creating Contract Account ------------"
echo "============================================================"

near create-account $CONTRACT_NAME --masterAccount $MASTER_ACCOUNT_ID

echo "============================================================="
echo "------------------- Deploying Contract ----------------------"
echo "=============================================================="

near deploy --wasmFile=./build/release/order-system.wasm --contractName=$CONTRACT_NAME --keyPath=$CREDENTIALS_ROOT_DIR/$CONTRACT_NAME.json