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
import { Check } from 'lucide-react'
import Image from 'next/image'
import { useInitializeVault } from '@/app/hooks/Initialize-vault-hook'

interface Token {
  id: string
  name: string
  symbol: string
  image:string
  color: string
  mint: string
}

const tokens: Token[] = [
  { id: 'usdc', name: 'USDC', symbol: 'USDC', image:"/usd-coin-usdc-logo.png", color: 'bg-blue-500', mint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' },
  { id: 'bonk', name: 'BONK', symbol: 'BONK', image:"/bonk1-bonk-logo.png", color: 'bg-orange-500', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { id: 'usdt', name: 'USDT', symbol: 'USDT', image:"/tether-usdt-logo.png", color: 'bg-green-500', mint: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS' },
  { id: 'sol', name: 'SOL', symbol: 'SOL', image:"/solana-sol-logo.png", color: 'bg-purple-500', mint: 'So11111111111111111111111111111111111111112' }
]

const CreateVaultModal: React.FC = () => {
  const { InitializeVault } = useInitializeVault();
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
            <Label>Select Token (Mint Address)</Label>
            <div className="grid grid-cols-2 gap-3">
              {tokens.map((token) => (
                <Card
                  key={token.id}
                  className={`relative cursor-pointer transition-all duration-150 hover:shadow-md ${
                    selectedToken === token.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedToken(token.id)}
                >
                  <div className="p-4 flex flex-col items-center justify-center">
                    {selectedToken === token.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                      {/* <span className="text-white font-bold text-sm">{token.symbol.slice(0, 2)}</span> */}
                      <Image src={token.image}  width={100} height={100} alt='icon'/>
                    </div>
                    
                    <span className="font-semibold text-sm">{token.name}</span>
                  </div>
                </Card>
              ))}
            </div>
            
            {selectedToken && (
              <div className="mt-2 p-2 bg-slate-100 rounded text-xs">
                <span className="font-medium">Mint: </span>
                <span className="text-slate-600 break-all">
                  {tokens.find(t => t.id === selectedToken)?.mint}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          {/* <Button onClick={handleSubmit} disabled={!selectedToken}> */}
          <Button onClick={()=> InitializeVault({mintAddress: tokens.find(t => t.id === selectedToken)?.mint || ""})} disabled={!selectedToken}>
            Create Vault
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateVaultModal