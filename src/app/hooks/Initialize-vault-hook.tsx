import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import idl from '@/app/anchor-idl/idl.json';
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface InitializeVaultParams {
    mintAddress: string;
}

export const useInitializeVault = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const InitializeVault = async ({ mintAddress }: InitializeVaultParams): Promise<string> => {
        console.log("Mint Address Input:", mintAddress);
        
        if (!wallet || !publicKey) {
            throw new Error("Wallet is not connected!!");
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
        message?: string 
    };
    
    if (err.message?.includes("already been processed")) {
        console.warn("Transaction was already processed - this might be a false error");
        // If you know the transaction succeeded, you might want to return a success status
        return "Transaction completed (already processed)";
    }
    console.error("Initialization failed:", err);
    throw error; 
}

    }

    const { mutateAsync: initializeNewVault, data, isPending, isSuccess, isError } = useMutation({
        mutationFn: InitializeVault,
        onSuccess: (data: string) => {
            // 'data' is the transaction signature string from InitializeVault
            toast.success("Vault Created Successfully!", {
                description: `Transaction: ${data}`,
                action: {
                    label: "View on Explorer",
                    onClick: () => window.open(`https://explorer.solana.com/tx/${data}?cluster=devnet`, '_blank')
                }
            });
        },
        onError: (error: Error) => {
            toast.error(`Failed to create vault. Please try again.: ${error.message}`);
        }
    });

    return { initializeNewVault, data, isPending, isSuccess, isError };
};