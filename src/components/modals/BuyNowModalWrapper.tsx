'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { closeBuyNowModal } from '@/store/slices/uiSlice'
import BuyNowModal from './BuyNowModal'

const BuyNowModalWrapper = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isBuyNowModalOpen } = useSelector((state: RootState) => state.ui)
  const { selectedProduct } = useSelector((state: RootState) => state.products)

  const handleClose = () => {
    dispatch(closeBuyNowModal())
  }

  return (
    <BuyNowModal
      isOpen={isBuyNowModalOpen}
      onClose={handleClose}
      product={selectedProduct || undefined}
    />
  )
}

export default BuyNowModalWrapper
