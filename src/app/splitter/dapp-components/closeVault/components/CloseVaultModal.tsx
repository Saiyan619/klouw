import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { useCloseVault } from '@/app/hooks/close-vault-hook';

interface ChildComponentProps {
  mint: string;
}

const CloseVaultModal = ({ mint }: ChildComponentProps) => {
  const { closeVault } = useCloseVault();
  const handleCloseVault = async () => {
    closeVault(mint);
  }
  return (
    <div>
      <AlertDialog>
            <AlertDialogTrigger asChild>
                  <Button>Close Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleCloseVault}>Close Vault</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default CloseVaultModal
