'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { setAuthModalOpen } from '@/store/slices/uiSlice'
import AuthModal from './AuthModal'

const AuthModalWrapper = () => {
  const dispatch = useDispatch()
  const { isAuthModalOpen, authModalMode } = useSelector((state: RootState) => state.ui)

  const handleClose = () => {
    dispatch(setAuthModalOpen(false))
  }

  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      defaultMode={authModalMode}
    />
  )
}

export default AuthModalWrapper

