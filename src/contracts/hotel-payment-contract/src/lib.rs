#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec, String, Address};

// Simple contract for hotel payments
#[contract]
pub struct HotelPaymentContract;

#[contractimpl]
impl HotelPaymentContract {
    /// Pay hotel function - stores payment information
    pub fn pay_hotel(
        env: Env,
        hotel_address: Address,
        amount: String,
        reservation_code: String,
    ) -> Vec<Symbol> {
        // Get the caller's address
        let payer = env.current_contract_address();
        
        // Store payment info in storage
        let payment_key = symbol_short!("payment");
        let payment_info = vec![
            &env,
            symbol_short!("payer"),
            Symbol::new(&env, "address"),
            symbol_short!("amount"),
            Symbol::new(&env, "value"),
            symbol_short!("reserve"),
            Symbol::new(&env, "code"),
        ];
        
        env.storage().persistent().set(&payment_key, &payment_info);
        
        // Return success message
        vec![&env, symbol_short!("Payment"), symbol_short!("success")]
    }

    /// Get last payment function - retrieves the most recent payment
    pub fn get_last_payment(env: Env) -> Vec<Symbol> {
        let payment_key = symbol_short!("payment");
        
        if let Some(payment_info) = env.storage().persistent().get(&payment_key) {
            payment_info
        } else {
            vec![&env, symbol_short!("No"), symbol_short!("payment"), symbol_short!("found")]
        }
    }

    /// Initialize the contract
    pub fn initialize(env: Env) {
        // Contract initialization
        let init_key = symbol_short!("init");
        env.storage().persistent().set(&init_key, &true);
    }
}


