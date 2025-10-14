'use client'

import React from 'react'
import NavBar from './dapp-components/NavBar'
import CreateVault from './dapp-components/createVault/CreateVault'
import { useWallet } from '@solana/wallet-adapter-react'
const TokenSpltterPage = () => {

  return (
      <div>
      <NavBar />
          <CreateVault />
      </div>
  )
}

export default TokenSpltterPage
