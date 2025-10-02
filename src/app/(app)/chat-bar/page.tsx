import ChatBarPreview from '@/components/modifier/chatBar/chatBarPreview'
import React from 'react'

function page({ defaultSettings }: any) {
  return (
    <div>
      <ChatBarPreview defaultSettings={defaultSettings} />
    </div>
  )
}

export default page