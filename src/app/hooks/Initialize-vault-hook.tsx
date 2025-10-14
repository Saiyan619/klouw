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
          
        } catch (error) {
            const err = error as Error & {
                logs?: string[];
                message?: string;
                code: string;
            };

             if (err.message?.includes("already been processed")) {
                console.warn("Transaction already processed (duplicate call ignored)");
                return "success"; // Return success since it actually worked
            }
    
            console.error("Error Message:", err.message);

            // Handle harmless client-side errors that shouldn't break the UI
            const safeErrors = [
                "This transaction already been processed",
            ];

            if (safeErrors.some(msg => err.message?.includes(msg))) {
                console.warn(
                    "Non-critical transaction warning — likely a duplicate simulation or post-send issue."
                );
                return;
            }

            throw error;
        }

    }

    return { InitializeVault };
};