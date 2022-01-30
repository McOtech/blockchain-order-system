#!/usr/bin/env bash

source ./scripts/config.conf

# Adds a product to the collection
near call $CONTRACT_NAME addProduct '{"name":"HP folio", "price":"50", "sFee":"3"}' --accountId $SELLER_ACCOUNT_ID

# Displays available products
near call $CONTRACT_NAME showProducts --accountId $SELLER_ACCOUNT_ID

# Removes Product of the given id
# Uncomment below to remove product

# near call $CONTRACT_NAME removeProduct "{\"id\": \"$PRODUCT_ID_TO_REMOVE_FROM_COLLECTION\"}" --accountId $SELLER_ACCOUNT_ID

# Displays available products
near view $CONTRACT_NAME showProducts --accountId $SELLER_ACCOUNT_ID
