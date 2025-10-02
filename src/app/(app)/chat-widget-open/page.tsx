import ChatWidgetPreview from '@/components/chat-widget-open/ChatWidgetPreview'
import React from 'react'

function page({defaultSettings}:any) {
  return (
    <div>
      <ChatWidgetPreview defaultSettings={defaultSettings}/>
    </div>
  )
}

export default page