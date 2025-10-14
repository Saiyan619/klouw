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
import { useWithDrawFunds } from '@/app/hooks/withdraw-funds-hook'

interface ChildComponentProps {
  mint: string;
}

const WithDrawFundsModal = ({mint}:ChildComponentProps) => {
    const { withdrawFunds } = useWithDrawFunds();
    const handleWithdrawFunds = () => {
        withdrawFunds(mint)
    };
  return (
    <div>
      <AlertDialog>
            <AlertDialogTrigger asChild>
                        <Button>Wtihdraw Funds</Button>
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
            <AlertDialogAction onClick={handleWithdrawFunds}>Withdraw</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default WithDrawFundsModal
