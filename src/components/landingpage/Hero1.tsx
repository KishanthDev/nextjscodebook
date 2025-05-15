'use client'
import React from 'react'
import Image from 'next/image'
import DemoBtn from './Hero1DemoBtn'

export default function Hero1() {
  return (
    <div className='m-20'>
      <h2
        className="text-4xl text-center mb-5 max-w-[55rem] mx-auto md:mb-5 font-bold [text-wrap:balance]"
      >
        LiveChat® is{" "}
        <span className="bg-gradient-to-r from-[#6AAAFF] via-[#6AAAFF] to-[#AF71FF] bg-clip-text text-transparent">
          intuitive customer service software
        </span>
        . Quick to set up, easy for your team to use <br />
        and a go-to choice for your customers.
      </h2>
      <div>
        <Image
          src="/landingpage/product-view--hero1.webp"
          alt="LiveChat® - AI customer service platform for your sales and customer support"
          width={1120}
          height={560}
          loading="lazy"
          className="hidden md:block w-full mb-5 ml-auto mr-auto"
          style={{ maxWidth: '1120px', maxHeight: '560px' }}
        />
      </div>
      <DemoBtn />
    </div>
  )
}