import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import idl from '@/app/anchor-idl/idl.json';
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface DepositVaultParams {
    mintAddress: string;
    amount: number;
}

export const useDepositVault = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    
    const depositVault = async ({mintAddress, amount}: DepositVaultParams) => {
        if (!wallet || !publicKey) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
            const programId = new PublicKey(idl.address);
            const program = new Program(idl, provider);

            const userAddressPubkey = publicKey;
            const mintAddressPubkey = new PublicKey(mintAddress);

            const [vaultInfoPDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("vault_info"),
                    userAddressPubkey.toBuffer(),
                    mintAddressPubkey.toBuffer()
                ],
                programId
            );

            const [vaultTokenAccPDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("token_vault"),
                    userAddressPubkey.toBuffer(),
                    mintAddressPubkey.toBuffer()
                ],
                programId
            );
                       
            const userTokenAcc = await getAssociatedTokenAddress(
                mintAddressPubkey,
                userAddressPubkey
            );

            // Use .transaction() instead of .rpc() to get the transaction first
            const transaction = await program.methods.depositVault(new BN(amount)).accounts({
                vaultInfo: vaultInfoPDA,
                vaultTokenAcc: vaultTokenAccPDA,
                userTokenAcc: userTokenAcc,
                signer: userAddressPubkey,
                mint: mintAddressPubkey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            }).transaction();

            // Send and confirm the transaction
            const signature = await provider.sendAndConfirm(transaction);
            
            console.log("Deposited successfully", signature);
            return signature;

        }catch (error: unknown) {
    const err = error as Error & { 
        logs?: string[]; 
        message?: string 
    };
    
    // More detailed error handling
    if (err.logs) {
        console.error("Transaction logs:", err.logs);
    }
    if (err.message?.includes("already been processed")) {
        console.warn("Transaction was already processed - this might be a false error");
        // If you know the transaction succeeded, you might want to return a success status
        return "Transaction completed (already processed)";
    }
    console.error("Deposit failed:", err);
    throw error; // Re-throw to handle in the UI component
}
    }

    return { depositVault };
}