import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

interface Identicon {
  account: string
}

export const Identicon: FC<Identicon> = ({ account }) => {
  return <Jazzicon diameter={24} seed={jsNumberForAddress(account)} />
}
