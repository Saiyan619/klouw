"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { useDepositVault } from '@/app/hooks/deposit-vault-hook'

interface ChildComponentProps {
  mint: string;
}

const DepositVaultModal = ({ mint }: ChildComponentProps) => {
    const { depositVault } = useDepositVault();
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleDeposit = async () => {
        if (!amount || parseInt(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        
        setIsLoading(true);
        try {
            await depositVault({ mintAddress: mint, amount: parseInt(amount) });
            // Success - you might want to close the dialog or show a success message
            setAmount(''); // Reset the amount
        } catch (error) {
            console.error("Deposit failed:", error);
            // Handle error in UI (show toast, alert, etc.)
        } finally {
            setIsLoading(false);
        }
    }

    return (
    <div className="w-full md:w-auto">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='w-full' variant="outline">Deposit Vault</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Deposit Vault</DialogTitle>
                        <DialogDescription>
                            Connect your wallet to create a new Vault
                        </DialogDescription>
                    </DialogHeader>
                
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isLoading}
                            />
                            <p className="text-sm text-muted-foreground">Enter the amount of tokens to deposit</p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={isLoading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleDeposit} disabled={isLoading || !amount}>
                            {isLoading ? "Processing..." : "Deposit Vault"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DepositVaultModal;