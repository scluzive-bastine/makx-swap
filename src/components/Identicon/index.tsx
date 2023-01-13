import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

interface Identicon {
  account: string
  diameter: number
}

export const Identicon: FC<Identicon> = ({ account, diameter }) => {
  return <Jazzicon diameter={diameter} seed={jsNumberForAddress(account)} />
}
