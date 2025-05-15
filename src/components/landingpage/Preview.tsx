'use client';

import { useRef } from 'react';

export default function Preview() {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e.target.value.length) {
            e.target.value = 'https://';
            setTimeout(() => {
                const input = inputRef.current;
                if (input) {
                    input.selectionStart = input.selectionEnd = input.value.length;
                }
            }, 0);
        }
    };

    return (
        <section
            id="website-preview-section"
            className="hidden md:flex flex-col items-center max-w-4xl mx-auto text-center"
        >
            <p className="text-3xl font-semibold">
                Preview LiveChat<span className='text-xl align-top'>®</span>
                <br />
                on your home page with&nbsp;one&nbsp;click
            </p>

            <form
                action="/website-preview/"
                method="GET"
                className="w-full mt-7"
            >
                <div className="flex justify-center flex-col sm:flex-row w-full max-w-xl mx-auto">
                    <input
                        ref={inputRef}
                        type="url"
                        name="url"
                        className="sm:mr-2 mb-2 sm:mb-0 px-4 py-2 border border-black rounded-lg w-full"
                        style={{ minWidth: '14rem', height: '58px' }}
                        placeholder="Your URL"
                        aria-label="Website address"
                        pattern="http(s)?://.*\..*"
                        title="http(s)://(www.)yourwebsite.xyz"
                        required
                        onFocus={handleFocus}
                    />
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-lg w-full sm:w-auto"
                        style={{ height: '58px' }}
                    >
                        Preview
                    </button>
                </div>
            </form>

        </section>
    );
}
