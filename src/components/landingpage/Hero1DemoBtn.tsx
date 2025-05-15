'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export default function DemoBtn() {
    const [isOpen,setIsOpen] = useState(false)
    return (
        <div>
            <div className="relative max-w-[40rem] mx-auto">
                {/* Trigger Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-black text-lg font-semibold py-2 px-4 border-2 border-black rounded-sm flex items-center mx-auto mt-3 max-w-max"
                >
                    Watch a <span className="hidden sm:inline mx-1">4-minute</span> LiveChat® demo
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="18"
                        fill="none"
                        className="ml-2"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1v16l13-8L1 1Z"
                        />
                    </svg>
                </button>

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-4xl bg-transparent">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-0 right-0 mt-2 mr-2 bg-white rounded shadow-lg hover:opacity-80"
                            >
                                <Image
                                    src="/icons/close.c1638c1fcdd839cdda84e54b9abda568c2efda235dbc39efb901ba9fa539554d.svg"
                                    alt="close"
                                    width={36}
                                    height={36}
                                    loading="lazy"
                                />
                            </button>

                            {/* YouTube Iframe */}
                            <iframe
                                className="w-full aspect-video rounded-lg shadow-xl"
                                src="https://www.youtube.com/embed/uCdPETQ6feU?rel=0&enablejsapi=1&version=3&playerapiid=ytplayer"
                                title="LiveChat® Demo"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}