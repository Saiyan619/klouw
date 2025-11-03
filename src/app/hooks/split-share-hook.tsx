import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import idl from '@/app/anchor-idl/idl.json';
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SplitAndShareParams {
  mintAddress: string;
  receipients: string[];
  // amounts: number[];
}
export const useSplitAndShare = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const splitAndShare = async ({ mintAddress, receipients }: SplitAndShareParams): Promise<string> => {
    if (!wallet || !publicKey) {
      throw new Error("wallet not connected!!!");
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

      // Validate each address is actually a token account
      const validatedAccounts = await Promise.all(
        receipients.map(async (addr) => {
          try {
            const pubkey = new PublicKey(addr);

            // Check if it's a valid public key
            if (!PublicKey.isOnCurve(pubkey)) {
              throw new Error(`Invalid public key: ${addr}`);
            }

            const tokenPubKey = await getAssociatedTokenAddress(mintAddressPubkey, pubkey)

            // Check if it's actually a token account
            const accountInfo = await connection.getAccountInfo(tokenPubKey);
            if (!accountInfo) {
              throw new Error(`Account not found: ${addr}`);
            }

            if (!accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
              throw new Error(`Not a token account: ${addr}`);
            }

            return {
              pubkey: tokenPubKey,
              isWritable: true,     // They receive tokens, so writable
              isSigner: false,      // Not signers
            };
          } catch (error) {
            console.error(`Invalid recipient ${addr}:`, error);
            throw error; // Or handle gracefully
          }
        })
      );
      const remainingAccounts = validatedAccounts;


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

      const tx = await program.methods.shareFunds().accounts({
        vaultInfo: vaultInfoPDA,
        vaultTokenAcc: vaultTokenAccPDA,
        signer: userAddressPubkey,
        userTokenAcc: userTokenAcc,
        mint: mintAddressPubkey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }).remainingAccounts(remainingAccounts).transaction();
      const txSig = await provider.sendAndConfirm(tx);
      console.log("split and share successful", txSig);
      return txSig;
    } catch (error: unknown) {
      const err = error as Error & {
        message?: string;
      };
      if (err.message?.includes("already been processed")) {
        console.warn("Transaction already processed (duplicate call ignored)");
        return "success"; // Return success since it actually worked
      }
      console.error(error);
      throw error;
    }
  }

  const { mutateAsync: SplitnShare, isPending } = useMutation({
    mutationFn: splitAndShare,
    onSuccess: (data: string) => {
      toast.success("Vault Closed Successfully!", {
        description: `Transaction: ${data}`,
        action: {
          label: "View on Explorer",
          onClick: () => window.open(`https://explorer.solana.com/tx/${data}?cluster=devnet`, '_blank')
        }
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to Close Vault. Please try again.: ${error.message}`);
    }
  })
  return { SplitnShare, isPending };
}