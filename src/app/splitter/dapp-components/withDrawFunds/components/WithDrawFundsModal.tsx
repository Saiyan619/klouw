import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useWithDrawFunds } from '@/app/hooks/withdraw-funds-hook'

interface ChildComponentProps {
  mint: string;
}

const WithDrawFundsModal = ({mint}:ChildComponentProps) => {
    const { withdraw, isPending } = useWithDrawFunds();
    const handleWithdrawFunds = () => {
        withdraw(mint)
    };
  return (
    <div className="w-full md:w-auto">
        <Dialog>
                      <DialogTrigger asChild>
                          <Button className='w-full'>Withdraw Funds</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                              <DialogTitle>Withdraw Funds</DialogTitle>
                              <DialogDescription>
                                  Are you absolutely sure?. This action cannot be undone.
                              </DialogDescription>
                          </DialogHeader>
                          
                          <DialogFooter>
                              <DialogClose asChild>
                                  <Button variant="outline" type="button" disabled={isPending}>
                                      Cancel
                                  </Button>
                              </DialogClose>
                              <Button onClick={handleWithdrawFunds} disabled={isPending}>
                                          {isPending ? "Withdrawing..." : "Withdraw Funds"}
                              </Button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
    </div>
  )
}

export default WithDrawFundsModal
