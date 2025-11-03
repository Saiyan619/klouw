"use client"
import Link from 'next/link'
import React from 'react'

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
          <defs>
            <pattern id="hexagons" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 80 23 L 80 70 L 40 93 L 0 70 L 0 23 Z"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/40 via-cyan-100/20 to-transparent opacity-60 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-50/30 to-transparent opacity-40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-gradient-to-l from-cyan-50/30 to-transparent opacity-30 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 mb-8 text-sm text-slate-700 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <h2 className="text-2xl font-semibold">Klouw</h2>
          </div>

          {/* Main heading */}
          <h1 className="text-balance text-6xl sm:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600">
              Token Splitting
            </span>{" "}
            Reimagined
          </h1>

          {/* Description */}
          <p className="text-balance text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Create vaults, deposit tokens, and split rewards across multiple addresses in one seamless flow. Perfect for
            teams, DAOs, and decentralized protocols.
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            {/* Create Vault */}
            <div className="group relative px-6 py-6 rounded-2xl bg-gradient-to-b from-white/80 to-white/40 border border-blue-200/30 backdrop-blur-sm hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl mb-3">🔐</div>
                <div className="text-base font-semibold text-slate-900">Create Vault</div>
                <div className="text-sm text-slate-600 mt-2">Initialize your token vault in seconds</div>
              </div>
            </div>

            {/* Deposit */}
            <div className="group relative px-6 py-6 rounded-2xl bg-gradient-to-b from-white/80 to-white/40 border border-cyan-200/30 backdrop-blur-sm hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-100/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl mb-3">💎</div>
                <div className="text-base font-semibold text-slate-900">Deposit Tokens</div>
                <div className="text-sm text-slate-600 mt-2">Secure transfers backed by smart contracts</div>
              </div>
            </div>

            {/* Split & Share */}
            <div className="group relative px-6 py-6 rounded-2xl bg-gradient-to-b from-white/80 to-white/40 border border-blue-200/30 backdrop-blur-sm hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl mb-3">✨</div>
                <div className="text-base font-semibold text-slate-900">Split & Share</div>
                <div className="text-sm text-slate-600 mt-2">Distribute to multiple addresses instantly</div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className='hover:underline' href="/splitter">
            <button
              className="relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 group"
            >
              Launch Klouw DApp
             
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-slate-300 text-slate-900 font-semibold text-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 bg-white/50 backdrop-blur-sm">
              Documentation
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) 
}
      // <Link className='hover:underline' href="/splitter">Go to App</Link>

export default HomePage
