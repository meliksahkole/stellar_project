#!/bin/bash

# Deploy Hotel Payment Contract to Stellar Testnet
# Make sure you have Stellar CLI installed and configured

echo "Building contract..."
cd src/contracts/hotel-payment-contract

# Build the contract
cargo build --target wasm32-unknown-unknown --release

if [ $? -eq 0 ]; then
    echo "Contract built successfully!"
    echo "Deploying to Stellar Testnet..."
    
    # Deploy the contract
    stellar contract deploy \
        --wasm target/wasm32-unknown-unknown/release/hotel_payment_contract.wasm \
        --source alice \
        --network testnet \
        --alias hotel_payment
    
    echo "Deployment complete!"
    echo "Don't forget to update CONTRACT_ID_PLACEHOLDER in ContractIntegration.tsx with the returned contract ID"
else
    echo "Contract build failed!"
    exit 1
fi


