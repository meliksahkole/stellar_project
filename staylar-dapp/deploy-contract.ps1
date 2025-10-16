# Deploy Hotel Payment Contract to Stellar Testnet
# Make sure you have Stellar CLI installed and configured

Write-Host "Building contract..." -ForegroundColor Green
Set-Location "src\contracts\hotel-payment-contract"

# Build the contract
cargo build --target wasm32-unknown-unknown --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "Contract built successfully!" -ForegroundColor Green
    Write-Host "Deploying to Stellar Testnet..." -ForegroundColor Yellow
    
    # Deploy the contract
    stellar contract deploy `
        --wasm target/wasm32-unknown-unknown/release/hotel_payment_contract.wasm `
        --source alice `
        --network testnet `
        --alias hotel_payment
    
    Write-Host "Deployment complete!" -ForegroundColor Green
    Write-Host "Don't forget to update CONTRACT_ID_PLACEHOLDER in ContractIntegration.tsx with the returned contract ID" -ForegroundColor Yellow
} else {
    Write-Host "Contract build failed!" -ForegroundColor Red
    exit 1
}


