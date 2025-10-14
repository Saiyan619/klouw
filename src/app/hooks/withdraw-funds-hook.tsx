import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import idl from '@/app/anchor-idl/idl.json';
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";


export const useWithDrawFunds = ()=>{
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const withdrawFunds = async (mintAddress: string) => {
        if (!wallet || !publicKey) {
            console.error("wallet not connected");
            return;
        }

        try {
            const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
            const programId = new PublicKey(idl.address);
            const program = new Program(idl, provider);
            
            const mintAddressPubkey = new PublicKey(mintAddress);
            const userAddressPubkey = publicKey;

            const userTokenAcc = await getAssociatedTokenAddress(
                mintAddressPubkey,
                userAddressPubkey
            )

            const [vaultInfoPDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("vault_info"),
                    userAddressPubkey.toBuffer(),
                    mintAddressPubkey.toBuffer()
                ],
                programId
            )
            const [vaultTokenAccPDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("token_vault"),
                    userAddressPubkey.toBuffer(),
                    mintAddressPubkey.toBuffer()
                ],
                programId
            )

            const tx = await program.methods.withdraw().accounts({
                vaultInfo: vaultInfoPDA,
                vaultTokenAcc: vaultTokenAccPDA,
                signer: userAddressPubkey,
                userTokenAcc: userTokenAcc,
                mint: mintAddressPubkey,
                tokenprogram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId
            }).transaction();
            const txSig = await provider.sendAndConfirm(tx);
            console.log("Withdraw Successful", txSig);
            return txSig;
            }catch (error: unknown) {
    const err = error as Error & { 
        message?: string 
    };
    
    if (err.message?.includes("already been processed")) {
        console.warn("Transaction was already processed - this might be a false error");
        // If you know the transaction succeeded, you might want to return a success status
        return "Transaction completed (already processed)";
    }
            console.error("Withdraw Error", error);
            throw error;
        }

    }

    return { withdrawFunds };
}