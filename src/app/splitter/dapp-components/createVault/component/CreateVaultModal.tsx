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
import { Card } from '@/components/ui/card'
import { Label } from "@/components/ui/label"
import { Check, Lock } from 'lucide-react'
import Image from 'next/image'
import { useInitializeVault } from '@/app/hooks/Initialize-vault-hook'

interface Token {
  id: string
  name: string
  symbol: string
  image: string
  color: string
  mint: string
  disabled?: boolean
}

const tokens: Token[] = [
  { id: 'usdc', name: 'USDC(devnet)', symbol: 'USDC', image: "/usd-coin-usdc-logo.png", color: 'bg-blue-500', mint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' },
  { id: 'bonk', name: 'BONK', symbol: 'BONK', image: "/bonk1-bonk-logo.png", color: 'bg-orange-500', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', disabled: true },
  { id: 'usdt', name: 'USDT', symbol: 'USDT', image: "/tether-usdt-logo.png", color: 'bg-green-500', mint: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS', disabled: true },
  { id: 'sol', name: 'SOL', symbol: 'SOL', image: "/solana-sol-logo.png", color: 'bg-purple-500', mint: 'So11111111111111111111111111111111111111112', disabled: true }
]

const CreateVaultModal: React.FC = () => {
  const { initializeNewVault, isPending } = useInitializeVault();
  const [selectedToken, setSelectedToken] = useState<string | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Vault</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Initialize Vault</DialogTitle>
          <DialogDescription>
            Connect your wallet to create a new Vault
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          
          <div className="grid gap-3">
            <Label>Select Token</Label>
            <div className="grid grid-cols-2 gap-3">
              {tokens.map((token) => (
                <Card
                  key={token.id}
                  className={`relative cursor-pointer transition-all duration-150 ${
                    token.disabled 
                      ? 'opacity-50 cursor-not-allowed bg-slate-100' 
                      : selectedToken === token.id
                        ? 'ring-2 ring-blue-500 bg-blue-50 hover:shadow-md'
                        : 'hover:bg-slate-50 hover:shadow-md'
                  }`}
                  onClick={() => !token.disabled && setSelectedToken(token.id)}
                >
                  <div className="p-4 flex flex-col items-center justify-center">
                    {token.disabled && (
                      <div className="absolute top-2 right-2 bg-slate-400 rounded-full p-1">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {selectedToken === token.id && !token.disabled && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                      <Image src={token.image} width={100} height={100} alt='icon'/>
                    </div>
                    
                    <span className="font-semibold text-sm">{token.name}</span>
                    {token.disabled && (
                      <span className="text-xs text-slate-500 mt-1">Coming Soon</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            
           
            
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Note:</span> Additional tokens (BONK, USDT, SOL) will be available in future updates.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={() => initializeNewVault({mintAddress: tokens.find(t => t.id === selectedToken)?.mint || ""})} 
            disabled={!selectedToken || isPending}
          >
            {isPending ? "Loading..." : "Create Vault"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateVaultModal