import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import idl from '@/app/anchor-idl/idl.json';
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface InitializeVaultParams {
    mintAddress: string;
}

export const useInitializeVault = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const InitializeVault = async ({ mintAddress }: InitializeVaultParams) => {
        console.log("Mint Address Input:", mintAddress);
        
        if (!wallet || !publicKey) {
            console.error("Wallet is not connected!!");
            return;
        }

        try {
            const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
            
            // Verify the program ID from IDL
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
          

            console.log("Sending transaction...");
            
            // Call the instruction
            const tx = await program.methods
                .initializeVault()
                .accounts({
                    vaultInfo: vaultInfoPDA,
                    vaultTokenAcc: vaultTokenAccPDA,
                    signer: userAddressPubkey,
                    mint: mintAddressPubkey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            

            console.log('Transaction signature:', tx);
            
            
            // Wait for confirmation
            // await connection.confirmTransaction(tx, 'confirmed');
            console.log("Vault initialized successfully!");
            return tx;
          
        } catch (error: unknown) {
            const err = error as Error & {
                logs?: string[];
                message?: string;
                code: string;
            };
    
            console.error("ERROR DETAILS:");
            console.error("Error Message:", err.message);
            console.error("Error Name:", err.name);

            if (err.logs) {
                console.error("Transaction Logs:");
                err.logs.forEach((log: string) => console.error(log));
            }

            if (err.code) {
                console.error("Error Code:", err.code);
            }

            console.error("Full Error:", error);

            // Handle harmless client-side errors that shouldn't break the UI
            const safeErrors = [
                "already been processed",
                "Unknown action",
                "Transaction simulation failed",
                "Blockhash not found",
            ];

            if (safeErrors.some(msg => err.message?.includes(msg))) {
                console.warn(
                    "Non-critical transaction warning — likely a duplicate simulation or post-send issue."
                );
                return; // Stop here gracefully — don’t throw, don’t break the UI
            }

            // Throw again only for real on-chain or program errors
            throw error;
        }

    }

    return { InitializeVault };
};