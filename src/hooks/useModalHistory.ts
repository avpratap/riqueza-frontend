'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface UseModalHistoryOptions {
  isOpen: boolean
  onClose: () => void
  modalId: string
  disabled?: boolean
}

/**
 * Custom hook to handle browser back button for modals
 * Pushes history state when modal opens and handles back button to close modal
 */
export const useModalHistory = ({ isOpen, onClose, modalId, disabled = false }: UseModalHistoryOptions) => {
  const pathname = usePathname()
  const historyPushedRef = useRef(false)
  const isHandlingPopStateRef = useRef(false)
  const pathnameRef = useRef(pathname)

  // Update pathname ref when it changes
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (disabled) return

    // When modal opens, push history state
    if (isOpen && !historyPushedRef.current) {
      try {
        // Save the current state before pushing modal state
        const previousState = window.history.state || {}
        const state = { 
          modal: modalId, 
          timestamp: Date.now(), 
          pathname: pathnameRef.current,
          previousState: previousState
        }
        window.history.pushState(state, '', pathnameRef.current)
        historyPushedRef.current = true
        console.log(`📜 History pushed for modal: ${modalId} on path: ${pathnameRef.current}`)
      } catch (error) {
        console.error('Error pushing history state:', error)
      }
    }

    // When modal closes programmatically (not via back button), clean up the history entry
    if (!isOpen && historyPushedRef.current && !isHandlingPopStateRef.current) {
      // Check if current state is our modal state and we're still on the same path
      const currentState = window.history.state as any
      const currentPathname = window.location.pathname
      
      if (currentState?.modal === modalId && currentPathname === pathnameRef.current) {
        // Replace the modal state with a clean state to remove our modal state
        // We use replaceState instead of back() to stay on the current page
        try {
          // Restore previous state if available, otherwise use empty state
          const previousState = currentState.previousState || {}
          window.history.replaceState(previousState, '', pathnameRef.current)
          console.log(`📜 History entry cleaned for modal: ${modalId} (staying on ${pathnameRef.current})`)
        } catch (error) {
          console.error('Error cleaning history state:', error)
        }
      } else {
        // Different path or state - just reset flags
        console.log(`📜 Modal ${modalId} closed, path/state changed. Resetting flags.`)
      }
      
      // Reset flags immediately
      historyPushedRef.current = false
      isHandlingPopStateRef.current = false
    }
  }, [isOpen, modalId, disabled])

  useEffect(() => {
    if (disabled) return

    const handlePopState = (event: PopStateEvent) => {
      // Check if we're closing a modal via back button
      if (historyPushedRef.current && isOpen) {
        const state = event.state as any
        const currentPathname = window.location.pathname
        
        // If there's no modal in state or it's a different modal, close this one
        // Also check if we're still on the same path (don't interfere with navigation)
        if ((!state?.modal || state.modal !== modalId) && currentPathname === pathnameRef.current) {
          console.log(`🔙 Browser back button detected, closing modal: ${modalId} on ${currentPathname}`)
          isHandlingPopStateRef.current = true
          
          // Close the modal immediately
          // The history has already been popped by the browser, so we just need to close the modal
          onClose()
          
          // Reset flag after closing
          setTimeout(() => {
            historyPushedRef.current = false
            isHandlingPopStateRef.current = false
          }, 50)
        } else if (currentPathname !== pathnameRef.current) {
          // User navigated to a different page - reset flags
          console.log(`🔙 Back button navigated to different page: ${currentPathname}. Resetting modal history.`)
          historyPushedRef.current = false
          isHandlingPopStateRef.current = false
        } else {
          // Same modal in state - this shouldn't happen, but log it
          console.log(`🔙 Back button pressed, but modal state matches. Ignoring.`)
        }
      }
    }

    // Only add listener when modal is open
    if (isOpen) {
      window.addEventListener('popstate', handlePopState)
    }

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isOpen, onClose, modalId, disabled])

  // Reset flags when pathname changes (user navigated to different page)
  useEffect(() => {
    // If pathname changed while modal is open, something went wrong
    // Reset flags to prevent issues
    if (isOpen && pathname !== pathnameRef.current) {
      console.log(`⚠️ Pathname changed while modal ${modalId} was open. Resetting.`)
      historyPushedRef.current = false
      isHandlingPopStateRef.current = false
    }
  }, [pathname, isOpen, modalId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset flags on unmount
      historyPushedRef.current = false
      isHandlingPopStateRef.current = false
    }
  }, [])
}
