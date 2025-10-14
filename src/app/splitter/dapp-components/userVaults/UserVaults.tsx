import { useGetAllVaults } from '@/app/hooks/get-vault-hook'
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BadgeCheckIcon } from 'lucide-react';
import DepositVaultModal from '../depositVault/components/DepositVaultModal';
import CloseVaultModal from '../closeVault/components/CloseVaultModal';
import WithDrawFundsModal from '../withDrawFunds/components/WithDrawFundsModal';
import { SplitAndShareModal } from '../splitNshare/components/SplitAndShareModal';

const UserVaults = () => {
    const { data, refetch } = useGetAllVaults();
    useEffect(() => {
      refreshVault();
    }, [refetch()])

    

     //         publicKey: vault.publicKey.toBase58(),
            //         owner: vault.account.owner.toBase58(),
            //         amount: vault.account.amount.toString(),
            //         mint: vault.account.mint.toBase58(),
            //         vaultInfoBump: vault.account.vaultInfoBump,
            //         vaultTokenBump: vault.account.vaultTokenBump,
            //         createdAt: new Date(vault.account.createdAt.toNumber() * 1000),
    
    const refreshVault = async () => {
      refetch();
    }
  return (
    <div>
          {/* <Button onClick={getUSDCTokenVault}>Get USdc vault details</Button> */}

      <div className='p-4'>
        <Button onClick={refreshVault}>Refresh Vaults</Button>
              {data?.map((vault) => {
              return(
                              <Card key={vault.publicKey.toString()}>
            <CardHeader>
        <CardTitle>
                              <span className='text-3xl'>{vault.account.amount.toString()} USDC</span>
        </CardTitle>
        <CardDescription>
          Account Balance
        </CardDescription>
        <CardAction>
          <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
                  <div className='flex justify-between'>
                      <span>Created:</span>
                      <span><span>
  {new Date(vault.account.createdAt.toNumber() * 1000).toLocaleString()}
</span>
</span>
    </div>

                     <div className='flex justify-between'>
                      <span>Mint:</span>
                      <span>{vault.account.mint.toBase58()}</span>
                  </div>
                  
      </CardContent>
    <CardFooter className="flex gap-2 p-4"> {/* Ensure padding and gap */}
                    <DepositVaultModal mint={vault.account.mint.toBase58()} />
    <SplitAndShareModal mint={vault.account.mint.toBase58()} />

                    <CloseVaultModal mint={vault.account.mint.toBase58()} />
                    <WithDrawFundsModal mint={vault.account.mint.toBase58()} />
  </CardFooter>
    </Card>
              )
          })}
          </div>
    </div>
  )
}

export default UserVaults
