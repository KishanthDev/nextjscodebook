import Header from '@/components/landingpage/Header'
import React from 'react'
import Footer from '@/components/landingpage/Footer'
import Hero1 from '@/components/landingpage/Hero1'
import Preview from '@/components/landingpage/Preview'
import Hero2 from '@/components/landingpage/Hero2'
import EngageSection from '@/components/landingpage/EngageSection'

function Page() {
  return (
    <div>
      <Header />
      <div className="border-b rounded-4xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <Hero1 />
      </div>
      <div className='my-10'>
        <Preview />
      </div>
      <EngageSection/>
      <Hero2/>
      <Footer />
    </div>
  )
}

export default Page
