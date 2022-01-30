#!/usr/bin/env bash

source ./scripts/config.conf

# Confirms order delivery
near call $CONTRACT_NAME confirmReturn "{\"orderId\": \"$ORDER_ID\", \"delivery\":\"$DELIVERY_ACCOUNT_ID\"}" --accountId $BUYER_ACCOUNT_ID 