'use client'

import { useState } from 'react'
import SharedTabNavigation from '@/components/shared/SharedTabNavigation'
import Performance from './Performance'
import Technology from './Technology'
import Design from './Design'

const ProductTabsSection = () => {
  const [activeTab, setActiveTab] = useState('Performance')

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="w-full px-8 lg:px-16">
        {/* Shared Tab Navigation */}
        <SharedTabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        {activeTab === 'Performance' && <Performance />}
        {activeTab === 'Technology' && <Technology />}
        {activeTab === 'Design' && <Design />}
      </div>
    </section>
  )
}

export default ProductTabsSection
