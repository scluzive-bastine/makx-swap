import Davatar from '@davatar/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NetworkContextName } from 'app/constants'
import { shortenAddress } from 'app/functions'
import { isTxConfirmed, isTxPending } from 'app/functions/transactions'
import useENSName from 'app/hooks/useENSName'
import WalletModal from 'app/modals/WalletModal'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'app/state/transactions/hooks'
import { TransactionDetails } from 'app/state/transactions/reducer'
import { useActiveWeb3React } from 'app/services/web3'
import { useNativeCurrencyBalances } from 'app/state/wallet/hooks'
import { NATIVE } from '@sushiswap/core-sdk'

import Image from 'next/image'
import React, { useMemo } from 'react'
import { useWeb3React } from 'web3-react-core'
import { Identicon } from '../Identicon'
import Loader from '../Loader'
import Dots from '../Dots'
import Typography from '../Typography'
import Web3Connect from '../Web3Connect'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

  const { ENSName, loading } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(isTxPending).map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length

  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center gap-2 text-sm rounded-lg text-primary group"
        onClick={toggleWalletModal}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between gap-2">
            <div>
              {pending?.length} {i18n._(t`Pending`)}
            </div>{' '}
            <Loader stroke="white" />
          </div>
        ) : (
          <div className="relative flex items-center gap-2 cursor-pointer pointer-events-auto border border-gray-700 rounded transition duration-200 ease-in-out">
            {account && chainId && (
              <Typography weight={700} variant="sm" className="px-3 font-bold">
                {userEthBalance ? (
                  `${userEthBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}`
                ) : (
                  <Dots>FETCHING</Dots>
                )}
              </Typography>
            )}
            <div className="flex space-x-1 items-center rounded bg-slate-800 group-hover:bg-slate-700 border-2 border-slate-900 py-2 px-2">
              <Typography
                weight={700}
                variant="sm"
                className="px-2 font-bold rounded-full text-inherit group-hover:text-white"
              >
                {ENSName ? ENSName.toUpperCase() : shortenAddress(account)}
              </Typography>
              <Davatar
                size={24}
                address={account}
                defaultComponent={<Identicon account={account} />}
                provider={library}
              />
            </div>
          </div>
        )}
        {/* {!hasPendingTransactions && connector && (
          <StatusIcon connector={connector} account={account} provider={library} />
        )} */}
      </div>
    )
  } else {
    return <Web3Connect color="blue" variant="filled" size="sm" className="rounded-lg" />
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(isTxPending).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter(isTxConfirmed).map((tx) => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
