#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_pay_hotel_and_get_last_payment() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HotelPaymentContract);
    let client = HotelPaymentContractClient::new(&env, &contract_id);

    // Create test addresses
    let hotel_address = Address::generate(&env);
    let payer_address = Address::generate(&env);

    // Set the caller address for the contract
    env.mock_all_auths();

    // Test payment
    let amount = String::from_str(&env, "100 XLM");
    let reservation_code = String::from_str(&env, "RES123456");

    let payment_result = client.pay_hotel(
        &hotel_address,
        &amount,
        &reservation_code,
    );

    // Verify payment result
    assert_eq!(payment_result.amount, amount);
    assert_eq!(payment_result.reservation_code, reservation_code);

    // Test getting last payment
    let last_payment = client.get_last_payment();
    
    // Verify last payment
    assert!(last_payment.is_some());
    let payment = last_payment.unwrap();
    assert_eq!(payment.amount, amount);
    assert_eq!(payment.reservation_code, reservation_code);
}

#[test]
fn test_get_last_payment_when_empty() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HotelPaymentContract);
    let client = HotelPaymentContractClient::new(&env, &contract_id);

    // Test getting last payment when no payments exist
    let last_payment = client.get_last_payment();
    assert!(last_payment.is_none());
}

#[test]
fn test_multiple_payments() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HotelPaymentContract);
    let client = HotelPaymentContractClient::new(&env, &contract_id);

    let hotel_address1 = Address::generate(&env);
    let hotel_address2 = Address::generate(&env);

    env.mock_all_auths();

    // First payment
    let amount1 = String::from_str(&env, "50 XLM");
    let reservation_code1 = String::from_str(&env, "RES001");
    
    client.pay_hotel(&hotel_address1, &amount1, &reservation_code1);

    // Second payment
    let amount2 = String::from_str(&env, "75 USDC");
    let reservation_code2 = String::from_str(&env, "RES002");
    
    client.pay_hotel(&hotel_address2, &amount2, &reservation_code2);

    // Verify last payment is the second one
    let last_payment = client.get_last_payment();
    assert!(last_payment.is_some());
    let payment = last_payment.unwrap();
    assert_eq!(payment.amount, amount2);
    assert_eq!(payment.reservation_code, reservation_code2);
}


