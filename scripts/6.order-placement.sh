#!/usr/bin/env bash

source ./scripts/config.conf

# Deposit Near to buyer's account
near call $CONTRACT_NAME deposit --amount=200 --accountId $BUYER_ACCOUNT_ID

# Checks buyer's account balance
near call $CONTRACT_NAME myBalance --accountId $BUYER_ACCOUNT_ID

# Places Order
near call $CONTRACT_NAME placeOrder "{\"delivery\": \"$DELIVERY_ACCOUNT_ID\"}" --accountId $BUYER_ACCOUNT_ID

# Checks buyer's cart content [should be null]
near call $CONTRACT_NAME viewCart --accountId $BUYER_ACCOUNT_ID
