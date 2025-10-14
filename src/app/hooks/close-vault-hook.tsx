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
                message?: string
            };
           
            // Silently handle the "already processed" error since transaction actually succeeded
            if (err.message?.includes("already been processed")) {
                console.warn("Transaction already processed (duplicate call ignored)");
                return "success"; // Return success since it actually worked
            }
           
            // Log other errors
            console.error("Close Vault Error:", err.message);
            // Only throw real errors
            throw error;
        }
    }
    
    return { closeVault };
}