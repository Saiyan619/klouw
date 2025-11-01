import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import idl from '@/app/anchor-idl/idl.json';
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface DepositVaultParams {
    mintAddress: string;
    amount: number;
}

export const useDepositVault = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    
    const depositVault = async ({mintAddress, amount}: DepositVaultParams):Promise<string> => {
        if (!wallet || !publicKey) {
            throw new Error("Wallet not conneted");
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

            const transaction = await program.methods
                .depositVault(new BN(amount))
                .accounts({
                    vaultInfo: vaultInfoPDA,
                    vaultTokenAcc: vaultTokenAccPDA,
                    userTokenAcc: userTokenAcc,
                    signer: userAddressPubkey,
                    mint: mintAddressPubkey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                }).rpc();
return transaction;
        }catch (error: unknown) {
    const err = error as Error & { 
        message?: string 
    };
    
    if (err.message?.includes("already been processed")) {
        console.warn("Transaction was already processed - this might be a false error");
        // If you know the transaction succeeded, you might want to return a success status
        return "Transaction completed (already processed)";
    }
    console.error("Deposit failed:", err);
    throw error; 
}
    }
     const { mutateAsync: depositToVault, data, isPending, isSuccess, isError } = useMutation({
            mutationFn: depositVault,
            onSuccess: (data: string) => {
                // 'data' is the transaction signature string from InitializeVault
                toast.success("Funds Deposited Successfully!", {
                    description: `Transaction: ${data}`,
                    action: {
                        label: "View on Explorer",
                        onClick: () => window.open(`https://explorer.solana.com/tx/${data}?cluster=devnet`, '_blank')
                    }
                });
            },
            onError: (error: Error) => {
                toast.error(`Failed to deposit funds. Please try again.: ${error.message}`);
            }
        });
    

    return { depositToVault, data, isPending, isSuccess, isError };
}