'use client'

import { useState } from 'react'

interface SharedTabNavigationProps {
  onTabChange: (tab: string) => void
  activeTab: string
}

const SharedTabNavigation = ({ onTabChange, activeTab }: SharedTabNavigationProps) => {
  const tabs = ['Performance', 'Design', 'Technology']

  return (
    <div className="flex gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 lg:mb-12 overflow-x-auto scrollbar-hide pb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`text-base sm:text-lg font-medium pb-2 border-b-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
            activeTab === tab
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default SharedTabNavigation
