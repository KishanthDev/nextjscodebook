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
      className="hidden md:flex flex-col items-center max-w-4xl mx-auto text-center my-10"
    >
      <p className="text-xl font-medium">
        Preview LiveChat®
        <br />
        on your home page with&nbsp;one&nbsp;click
      </p>

      <form
        action="/website-preview/"
        method="GET"
        className="w-full mt-4"
      >
        <div className="flex flex-col sm:flex-row max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="url"
            name="url"
            className="sm:mr-2 mb-2 sm:mb-0 px-4 py-2 border rounded w-full sm:w-auto"
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
            className="bg-black text-white px-6 py-2 rounded"
            style={{ height: '58px' }}
          >
            Preview
          </button>
        </div>
      </form>
    </section>
  );
}
