 "use client"
import React from 'react'   
import Link from "next/link"
import { Wallet, Wallet2 } from "lucide-react"
import { WalletButton } from '@/app/WalletButton'


const NavBar = () => {
  return (
   
         <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-mono text-lg font-bold text-primary-foreground">K</span>
          </div>
          <span className="text-xl font-semibold">Klouwso</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </Link>
          <Link
            href="/app"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Launch App
          </Link>
        </nav>

          <WalletButton />

      </div>
    </header>

  )
}

  
export default NavBar
