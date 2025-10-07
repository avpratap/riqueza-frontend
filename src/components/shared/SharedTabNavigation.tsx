'use client'

import { useState } from 'react'

interface SharedTabNavigationProps {
  onTabChange: (tab: string) => void
  activeTab: string
}

const SharedTabNavigation = ({ onTabChange, activeTab }: SharedTabNavigationProps) => {
  const tabs = ['Performance', 'Design', 'Technology']

  return (
    <div className="flex gap-8 mb-12">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`text-lg font-medium pb-2 border-b-2 transition-colors duration-200 ${
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
