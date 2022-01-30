#!/usr/bin/env bash

source ./scripts/config.conf

# Adds the product of the specified Id to the cart with the given quantity

near call $CONTRACT_NAME addToCart "{\"id\": \"$PRODUCT_ID_TO_ADD_TO_CART\", \"qty\":\"$QUANTITY\"}" --accountId $BUYER_ACCOUNT_ID

# Removes from cart the product of the specified id

# near call $CONTRACT_NAME removeFromCart "{\"id\": \"$PRODUCT_ID_TO_REMOVE_FROM_CART\"}" --accountId $BUYER_ACCOUNT_ID

near call $CONTRACT_NAME viewCart --accountId $BUYER_ACCOUNT_ID
