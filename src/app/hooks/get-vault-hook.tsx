import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import idl from '@/app/anchor-idl/idl.json';
import { TokenSplitter } from "@/app/anchor-idl/idlType";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";


interface GetVaultParams {
    mintAddress: string;
}
export const useGetVault = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const getVault = async ({ mintAddress }: GetVaultParams) => {
        if (!wallet || !publicKey) {
            console.error("❌ Wallet is not connected!!");
            return;
        }

        try {
            const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
            const programId = new PublicKey(idl.address);
            const program = new Program<TokenSplitter>(idl as TokenSplitter, provider);
        
            const userAddressPubkey = publicKey;
            const mintAddressPubkey = new PublicKey(mintAddress);
        
            console.log("\n📍 Addresses:");
            console.log("User Address:", userAddressPubkey.toBase58());
            console.log("Mint Address:", mintAddressPubkey.toBase58());
        
            // Verify mint exists
            const mintAccountInfo = await connection.getAccountInfo(mintAddressPubkey);
            if (!mintAccountInfo) {
                console.error("❌ Mint account doesn't exist!");
                throw new Error("Mint not found on-chain");
            }
            console.log("✅ Mint exists on-chain");
            console.log("Mint Owner:", mintAccountInfo.owner.toBase58());
        
            // Derive PDAs with detailed logging
            console.log("\n🔑 Deriving PDAs:");
            console.log("Seeds for vaultInfo:");
            console.log("  - 'vault_info'");
            console.log("  - user:", userAddressPubkey.toBase58());
            console.log("  - mint:", mintAddressPubkey.toBase58());
        
            const [vaultInfoPDA, vaultInfoBump] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("vault_info"),
                    userAddressPubkey.toBuffer(),
                    mintAddressPubkey.toBuffer()
                ],
                programId
            );
                   
            const [vaultTokenAccPDA, vaultTokenBump] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("token_vault"),
                    userAddressPubkey.toBuffer(),
                    mintAddressPubkey.toBuffer()
                ],
                programId
            );
        
            console.log("VaultInfoPDA:", vaultInfoPDA.toBase58(), "Bump:", vaultInfoBump);
            console.log("TokenVaultPDA:", vaultTokenAccPDA.toBase58(), "Bump:", vaultTokenBump);
        
            // Check vault account status
            console.log("\n🔍 Checking vault account status:");
            const vaultAccount = await connection.getAccountInfo(vaultInfoPDA);
                    
            if (vaultAccount !== null) {
                console.log("⚠️  Vault account EXISTS");
                console.log("Account Owner:", vaultAccount.owner.toBase58());
                console.log("Account Data Length:", vaultAccount.data.length);
                console.log("Account Lamports:", vaultAccount.lamports);
                        
                // Check if it's owned by our program
                if (vaultAccount.owner.toBase58() !== programId.toBase58()) {
                    console.error("❌ VAULT OWNED BY WRONG PROGRAM!");
                    console.error("Expected:", programId.toBase58());
                    console.error("Got:", vaultAccount.owner.toBase58());
                    throw new Error("Vault account exists but owned by wrong program");
                }
        
                // Try to deserialize the vault data
                try {
                    const vaultData = await program.account.vaultInfo.fetch(vaultInfoPDA);
                    console.log("\n📊 Existing Vault Data:", vaultData);
                    console.log("Owner:", vaultData.owner.toBase58());
                    console.log("Amount:", vaultData.amount.toString());
                    console.log("Mint:", vaultData.mint.toBase58());
                    console.log("Created At:", new Date(vaultData.createdAt.toNumber() * 1000).toISOString());
                } catch (error) {
                    console.error("❌ Failed to deserialize vault data:", error);
                }
            }
        }
         catch (error) {
                console.error(error)
            }
    }
    return { getVault };
        }


export const useGetAllVaults = () => {
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const getAllVaults = async () => {
        if (!wallet || !publicKey) {
            console.error("Wallet is not connected!!");
            return;
        }
        try {
            const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
            const program = new Program<TokenSplitter>(idl as TokenSplitter, provider);
            const userAddressPubkey = publicKey;
            // Fetch all vault accounts owned by this user
            const allVaults = await program.account.vaultInfo.all([
                {
                    memcmp: {
                        offset: 8, // Skip 8-byte discriminator
                        bytes: userAddressPubkey.toBase58(), // Filter by owner (first field after discriminator)
                    }
                }
            ]);

            // console.log("Fetching all vaults for user:", userAddressPubkey.toBase58());
            // console.log(`Found ${allVaults.length} vault(s)`);
            // Format the data
            // const formattedVaults = allVaults.map((vault) => {
            //     const data = {
            //         publicKey: vault.publicKey.toBase58(),
            //         owner: vault.account.owner.toBase58(),
            //         amount: vault.account.amount.toString(),
            //         mint: vault.account.mint.toBase58(),
            //         vaultInfoBump: vault.account.vaultInfoBump,
            //         vaultTokenBump: vault.account.vaultTokenBump,
            //         createdAt: new Date(vault.account.createdAt.toNumber() * 1000),
            //     };
                
            //     console.log("Vault data:", data);
            //     return data;
            // });

            const data = allVaults;
            return data;

        } catch (error) {
            console.error(error);
        }
    }
     const { data, refetch } = useQuery({
    queryKey: ['allVaults', publicKey?.toBase58()],
    queryFn: () => getAllVaults(),
    enabled: !!connected && !!publicKey, // runs only when connected
  });
    return { data, refetch };
}