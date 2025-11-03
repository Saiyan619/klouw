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
import { useCloseVault } from '@/app/hooks/close-vault-hook';

interface ChildComponentProps {
  mint: string;
}

const CloseVaultModal = ({ mint }: ChildComponentProps) => {
  const { close, isPending } = useCloseVault();
  const handleCloseVault = async () => {
    close(mint);
  }
  return (
    <div className="w-full md:w-auto">

      <Dialog>
        <DialogTrigger asChild>
          <Button className='w-full'>Close Vault</Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Close Vault</DialogTitle>
            <DialogDescription>
              Are you absolutely sure?. This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCloseVault} disabled={isPending}>
              {isPending ? "Closing..." : "Close Vault"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CloseVaultModal
