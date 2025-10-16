# Staylar - Hotel Payment dApp

A minimal blockchain-based hotel payment application built with Next.js, TypeScript, Tailwind CSS, and Stellar Soroban smart contracts.

## Features

- ✅ Freighter Wallet Integration
- ✅ Modern UI with Tailwind CSS
- ✅ Stellar Soroban Smart Contract
- ✅ Hotel Payment Processing
- ✅ Payment History Display
- ✅ TypeScript Support

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Stellar Soroban, Stellar SDK
- **Wallet**: Freighter API
- **Network**: Stellar Testnet

## Project Structure

```
staylar-dapp/
├── src/
│   ├── app/
│   │   ├── main/           # Payment page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Connect page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── WalletConnection.tsx      # Freighter wallet integration
│   │   └── ContractIntegration.tsx   # Soroban contract calls
│   └── contracts/
│       └── hotel-payment-contract/   # Rust Soroban contract
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Smart Contract Functions

### `pay_hotel(hotel_address, amount, reservation_code)`
- Stores payment information on the blockchain
- Returns payment details
- Uses persistent storage

### `get_last_payment()`
- Retrieves the most recent payment
- Returns payment info (payer, amount, reservation_code)

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Freighter Wallet browser extension
- Stellar CLI (for contract deployment)

### 1. Install Dependencies
```bash
cd staylar-dapp
npm install
```

### 2. Install Freighter Wallet
Install the Freighter browser extension from [freighter.app](https://freighter.app/)

### 3. Get Testnet XLM
- Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
- Create a test account and fund it with testnet XLM

### 4. Deploy Smart Contract (Optional)
```bash
# Navigate to contract directory
cd src/contracts/hotel-payment-contract

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet (requires Stellar CLI)
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hotel_payment_contract.wasm \
  --source your-source-key \
  --network testnet \
  --alias hotel_payment
```

### 5. Update Contract ID
After deployment, update the `CONTRACT_ID_PLACEHOLDER` in `src/components/ContractIntegration.tsx` with your actual contract ID.

### 6. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to start using the dApp.

## Usage Flow

1. **Connect Wallet**: Click "Connect Freighter Wallet" on the home page
2. **Make Payment**: 
   - Enter payment amount (e.g., "10 XLM" or "100 USDC")
   - Enter hotel wallet address
   - Enter reservation code
   - Click "Pay Now"
3. **View History**: Last payment information is displayed on the right panel

## Development Notes

- The contract uses persistent storage to save payment information
- All transactions are signed using Freighter wallet
- The app runs on Stellar Testnet for testing
- Contract responses are logged to console for debugging

## Troubleshooting

### Wallet Connection Issues
- Ensure Freighter extension is installed and unlocked
- Check that you're on the correct network (Testnet)
- Try refreshing the page and reconnecting

### Contract Interaction Issues
- Verify contract ID is correctly set in ContractIntegration.tsx
- Check browser console for detailed error messages
- Ensure you have sufficient XLM for transaction fees

### Build Issues
- Make sure all dependencies are installed: `npm install`
- Check Node.js version compatibility
- Clear Next.js cache: `rm -rf .next`

## Next Steps

This is a minimal implementation. For production use, consider:
- Adding proper error handling
- Implementing fee calculations
- Adding access control to contract functions
- Creating a proper backend for additional functionality
- Adding more comprehensive testing

## License

MIT License


