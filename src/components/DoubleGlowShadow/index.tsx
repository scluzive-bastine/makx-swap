import { classNames } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'

const DoubleGlowShadow: FC<{ className?: string }> = ({ children, className }) => {
  const isDesktop = useDesktopMediaQuery()
  if (!isDesktop) return <>{children}</>

  return (
    <div className={classNames(className, 'relative w-full max-w-2xl')}>
      <div
        className={classNames('bg-gradient-to-t from-[#070816] to-slate-900 fixed inset-0 z-0 pointer-events-none')}
      />
      <div className="relative filter z-10">{children}</div>
    </div>
  )
}

export default DoubleGlowShadow
