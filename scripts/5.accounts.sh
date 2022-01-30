#!/usr/bin/env bash

source ./scripts/config.conf

echo "============================================================="
echo "-------------- Seller Active Balance -----------------------"
echo "============================================================="

near call $CONTRACT_NAME myBalance --accountId $SELLER_ACCOUNT_ID

echo "============================================================="
echo "-------------- Buyer Active Balance -----------------------"
echo "============================================================="

near call $CONTRACT_NAME myBalance --accountId $BUYER_ACCOUNT_ID

echo "============================================================="
echo "-------------- Delivery Active Balance -----------------------"
echo "============================================================="

near call $CONTRACT_NAME myBalance --accountId $DELIVERY_ACCOUNT_ID