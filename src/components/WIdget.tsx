'use client';

import Image from 'next/image';

const CloseIcon = () => (
    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 32 32" fill="currentColor">
        <path d="M17.4,16l5.3,5.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L16,17.4l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0 c-0.4-0.4-0.4-1,0-1.4l5.3-5.3l-5.3-5.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0 c0.4,0.4,0.4,1,0,1.4L17.4,16z" />
    </svg>
);


export default function LiveChatWidget() {
    return (
        <div className="flex flex-col w-[230px] mx-auto bg-white rounded-lg shadow-lg relative">
            {/* Close Button */}
            <div className="absolute -top-9 right-0 z-10">
                <button
                    aria-label="Hide greeting"
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <CloseIcon />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col ">
                <div className="flex space-x-4">
                    <Image
                        src="/landingpage/hello01.png"
                        alt="Hello"
                        width={230}
                        height={150}
                        className="object-contain"
                    />
                </div>

                <div className="p-3.5">
                    <h2 className="mb-2 text-gray-800">
                        Welcome to LiveChat!
                    </h2>
                    <p className="text-gray-600">
                        Sign up free or talk with our product experts
                    </p>
                </div>

                <ul className="flex pt-[7px] pr-2 pb-2 pl-2 gap-2
 flex-col">
                    <li>
                        <button
                            className="px-4 py-2 w-full justify-center bg-orange-600 text-white rounded-md  transition flex"
                        >
                            Free trial
                        </button>
                    </li>
                    <li>
                        <button
                            className="px-4 py-2 w-full justify-center bg-black text-white rounded-md transition flex items-center"
                        >
                            <span className="mr-2">💬</span> Product expert
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}