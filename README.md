# Klouw — Solana USDC Splitter (Anchor + Next.js)

Klouw is a Solana-based token splitter that allows users to deposit USDC, split it across multiple recipients, and distribute funds in a single transaction.  
It is designed with a clean Anchor program architecture, safe token handling, and a modern Next.js frontend for an intuitive user experience.

This project demonstrates full-stack web3 engineering on Solana, including program design, CPI token transfers, secure state management, and a production-ready frontend.
---

## Features

### Core Functionality
- Deposit and store USDC in a shared pool.
- Define multiple recipient accounts and their respective split percentages.
- Single-instruction batch token distribution.
- Uses SPL Token Program instructions for secure transfers.
- Prevents over-distribution through robust validation logic.

### Blockchain Program (Anchor)
- Written in Rust using the Anchor framework.
- PDA-based state for storing pool configurations.
- Standardised token account handling for safety.
- Clear separation of instructions, state, and checks.
- Compiled and deployed on Solana.

### Frontend (Next.js)
- Modern Next.js application with server-side rendering support.
- Wallet adapter integration for wallet connections.
- UI for configuring recipients, percentages, and executing splits.
- Real-time display of pool state and balances.
- Clean component architecture and TypeScript across the project.

---

## Tech Stack

### On-Chain Program
- Rust  
- Anchor Framework  
- Solana Program Library (SPL Tokens)
- CPIs

### Frontend
- Next.js  
- React  
- TypeScript  
- Solana Wallet Adapter  
- TailwindCSS

---

## Repository Links

- Frontend: https://github.com/Saiyan619/klouw  
- Blockchain Program: [https://github.com/Saiyan619/klouw_program](https://github.com/Saiyan619/token-splitter)

---

## Project Structure

### Frontend
```
src/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── lib/solana/
 ├── services/
 ├── types/
 └── app/
```

### Anchor Program
```
programs/
 └── klouw/
     ├── src/
     │    ├── lib.rs
     │    ├── instructions/
     │    ├── state/
     │    ├── errors.rs
     │    └── constants.rs
     └── Cargo.toml
```

---

## Running the Project Locally

### Frontend
```
git clone https://github.com/Saiyan619/klouw
cd klouw
npm install
npm run dev
```

### Program (Blockchain)
```
git clone https://github.com/Saiyan619/klouw_program
cd klouw_program
anchor build
anchor deploy
```

Update your frontend `.env` with the deployed program ID when finished.

---

If you want, I can also write a version that includes a “Motivation and Design Decisions” section or a “How It Works Internally” deep dive.
