import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import idl from '@/app/anchor-idl/idl.json';
// import { TokenSplitter } from "@/app/anchor-idl/idlType";
import { PublicKey, SystemProgram,  } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const useCloseVault = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
   
    const closeVault = async (mintAddress: string) => {
        if (!wallet || !publicKey) {
            console.error("Wallet not connected");
            return;
        }
       
        try {
            const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
            const programId = new PublicKey(idl.address);
            const program = new Program(idl, provider);
            const mintAddressPubkey = new PublicKey(mintAddress);
            const userAddressPubkey = publicKey;
            
            // Get the user's Associated Token Account for this mint
            // Note: This is required by the program but not actually used in the close_vault logic
            const userTokenAcc = await getAssociatedTokenAddress(
                mintAddressPubkey,
                userAddressPubkey,
                false // allowOwnerOffCurve - standard ATA derivation
            );

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

            const tx = await program.methods.closeVault().accounts({
                vaultInfo: vaultInfoPDA,
                vaultTokenAcc: vaultTokenAccPDA,
                signer: userAddressPubkey,
                userTokenAcc: userTokenAcc, // Changed from userAddressPubkey to userTokenAcc
                mint: mintAddressPubkey,
                tokenprogram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
             .rpc();

            // const txSig = await provider.sendAndConfirm(tx);
            console.log("Vault closed successfully! Transaction:", tx);
            return tx;
           
        }catch (error: unknown) {
    const err = error as Error & { 
        logs?: string[]; 
        code?: string; 
        message?: string 
    };
    
    if (err.logs) {
        console.error("Transaction Logs:");
        err.logs.forEach((log: string) => console.error(log));
    }
    if (err.code) {
        console.error("Error Code:", err.code);
    }
    console.error("Full Error:", err);
    
    // Handle harmless client-side errors that shouldn't break the UI
    const safeErrors = [
        "already been processed",
        "Unknown action",
        "Transaction simulation failed",
        "Blockhash not found",
    ];
    
    if (safeErrors.some(msg => err.message?.includes(msg))) {
        console.warn(
            "⚠️ Non-critical transaction warning — likely a duplicate simulation or post-send issue."
        );
        return; // Stop here gracefully — don't throw, don't break the UI
    }
    
    // Throw again only for real on-chain or program errors
    throw error;
}

    }
    
    return { closeVault };
}