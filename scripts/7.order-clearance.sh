#!/usr/bin/env bash

source ./scripts/config.conf

# Depositing Near into delivery account
near call $CONTRACT_NAME deposit --amount=100 --accountId $DELIVERY_ACCOUNT_ID

# Clearing order of the provided order id for shipment.

near call $CONTRACT_NAME clearShipment "{\"orderId\": \"$ORDER_ID\"}" --accountId $DELIVERY_ACCOUNT_ID