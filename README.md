# ORDER SYSTEM

This project draws its concept from web2 online order processing systems. It utilizes Near protocol, a layer one blockchain technology, to implement a demo of the online order processing system in web3.

[`Youtube Video Demo`](https://www.youtube.com/watch?v=nmh248_0UJs)

# Challenges Adressed

1. `Trust without assurity`: Buyers' checkout `(transfer their cash)` trusting that the sellers will deliver the commodities they have ordered. On the other hand, sellers hope that those doing deliveries will definitely deliver the commidities to their customers without any inconvenience.

# What-if statement

What if any of the party disappears before the order is completely processed?

# Scenario of the project concept

`Alice` owns an online store selling various computer items and accessories. `Bob` is a potential buyer who wants the commodities he will order to be delivered to him. `Fred` owns a motocycle which he uses to make deliveries to various clients.

Bob then decides to purchase an accessory. He visits Alice's website and selects the accessories he need adding each to his cart with their respective quantities. On checking out, he selects Fred as the delivery guy and the amount due is calculated by summing up the cost of accessories in their respective quantities and the shipping fee. This amount is deducted from his active account balance and locked until he confirms to have received the accessories.

Fred then goes to pick the accessories from Alice for delivery. He acknowledges picking the accessories by providing the order reference [id] during which the cost of accessories in their respective quantities is deducted from his active balance and locked until he either makes the delivery to Bob or returns the accessories in the event Bob is not found.

Fred is a man of integrity, he delivers the accessories to Bob and eventually Bob confirms the delivery by providing order reference [id] and Fred's account reference [id]. This is when the actual transfer of money which was initially locked transfered to their respective recipient accounts.

Let's see how:
Bob's locked amount implied that the order's amount due will all be cashed into the Fred's [delivery] account ONLY if he [Bob] confirms that he has received his products.
Fred's locked amount implied that the total cost of accessories in their respective quantities `minus` the shipping fee, will all be cashed into Alice's [seller] account ONLY if Bob confirms that the accessories have reached him. In the event that Fred returns the accessories for whatever reason, Fred's locked amount will be credited back into his account plus the order shipping fee ONLY if Alice [seller] confirms the return.

In this scenario you don't have to trust any party in transacting the business.

# Prerequisites

To successfully execute this project's code, ensure you have the following.

1. Install `node` v14.16.0 or switch to the version if you use node version manager `nvm`
2. Install `near-cli` globally for contract deployment and function calls.
3. Install `assemblyscript` globally for compilation to web assembly files and other related tasks.
4. Login to atleast three testnet accounts from your terminal for each of the three accounts to have their credential files for various function calls
5. Ensure you have `git` installed as well.
6. Ensure `yarn` is installed in your environment.

# PROJECT SETUP

Clone the project:

     git clone https://github.com/McOtech/blockchain-order-system.git

cd into the project directory and proceed with rest of operation from the root folder.

Install necessary packages:

     yarn

Navigate to the `./scripts/config.conf` file from the root directory and open it in you favourite editor.

Provide the values of the uncommented variables with placeholder statement replacing the placeholders with the correct values.

     # Deployment variables
     CREDENTIALS_ROOT_DIR=<credentials-root-directory>
     CONTRACT_NAME=<contract-accountId>
     BENEFICIARY_ACCOUNT_ID=<beneficiary-accountId>
     MASTER_ACCOUNT_ID=<master-accountId>

     # Accounts
     BUYER_ACCOUNT_ID=<buyer-accountId>
     SELLER_ACCOUNT_ID=<seller-accountId>
     DELIVERY_ACCOUNT_ID=<delivery-accountId>

NOTE: The contract name `<contract-accountId>` must be a sub account of the master account `<master-accountId>`

Navigate to the `./assembly/index.ts` file from the root directory and open it in you favourite editor.

Provide the seller account id:

       seller: string = '<seller-accountId>';

NOTE: Ensure the `SELLER_ACCOUNT_ID` value provided in the `./scripts/config.conf` is strictly equal to that provided in `./assembly/index.ts`

# RUNNING SCRIPTS

Fire up your terminal from the project's root directory and proceed. You may need to grant permission to run the scripts.

     chmod 755 ./scripts/*

Run test:

     ./scripts/0.test.sh

Generate web assembly file `build file`:

     ./scripts/1.build.sh

Deploy the contract:

     ./scripts/2.deploy.sh

Add product for sale and view the list of product in the collection:

     ./scripts/3.product.sh

Edit `./scripts/3.product.sh` to add other products.
To remove a product from the list, uncomment the `PRODUCT_ID_TO_REMOVE_FROM_COLLECTION` variable and provide the id of product to be removed as it value.

     PRODUCT_ID_TO_REMOVE_FROM_COLLECTION=

Add product to cart:

Uncomment the following line in `./scripts/config.conf` file and provide the id of the product to be added to cart as the value. You can as well change the value of the `QUANTITY` variable of the product.

     # PRODUCT_ID_TO_ADD_TO_CART=

Then run:

     ./scripts/4.cart.sh

To remove item from cart, uncomment the following line in `./scripts/config.conf` file and provide the id of the product to be removed from cart as the value of `PRODUCT_ID_TO_REMOVE_FROM_CART`.

     # PRODUCT_ID_TO_REMOVE_FROM_CART=

View Account Balances:

     ./scripts/5.accounts.sh

Place order:

    ./scripts/6.order-placement.sh

NOTE: copy the `order id` displayed after running the script, uncomment the line in `./scripts/config.conf` as illustrated below and paste it as the value to `ORDER_ID`. This is required for further scripts.

    ORDER_ID=<order-id>

Clear order for delivery:

    ./scripts/7.order-clearance.sh

Confirm Delivery:

    ./scripts/8.order-delivery.sh

Confirm Order Return:

    ./scripts/9.order-return.sh

Thank you. Let's build on near #nearprotocol. Let's liberate the web.
