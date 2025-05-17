'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function EngageSection() {
  useEffect(() => {
    const increaseSalesVideoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) {
            const videoSrc = target.getAttribute('data-src');
            if (videoSrc) {
              const video = document.createElement('video');
              Object.assign(video, {
                src: videoSrc,
                controls: false,
                autoplay: true,
                loop: true,
                muted: true,
              });
              target.appendChild(video);
              video.classList.add('rounded-3xl', 'animate-fade-in-up');
            }
            increaseSalesVideoObserver.unobserve(target);
          }
        });
      },
      { rootMargin: '200px', threshold: 0 }
    );

    const videoElement = document.getElementById('increase-sales-video');
    if (videoElement) {
      increaseSalesVideoObserver.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        increaseSalesVideoObserver.unobserve(videoElement);
      }
    };
  }, []);

  return (
    <section
      className="w-full px-4 py-6 md:py-8 md:pb-8 mb-6 md:mb-16 rounded-[32px] border border-black/40 bg-white"
      style={{
        boxShadow:
          '0px 149px 42px 0px rgba(0, 0, 0, 0.00), 0px 95px 38px 0px rgba(0, 0, 0, 0.01), 0px 53px 32px 0px rgba(0, 0, 0, 0.02), 0px 24px 24px 0px rgba(0, 0, 0, 0.04), 0px 6px 13px 0px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="w-full mx-auto">
        <div className="text-center md:text-left">
          <p className="text-xs text-black/50 border border-black/40 rounded-[32px] px-2 py-1 mb-3 inline-block">
            INCREASE ONLINE SALES
          </p>
        </div>
        <div className="flex justify-between">
          <h2
            className="text-[clamp(2.625rem,2rem+(1.5*(100vw-36rem)/49),3.5rem)] mb-2 font-medium"
            style={{ textWrap: 'balance' }}
          >
            Engage with live chat, sell with ease
          </h2>
          <p className="max-w-[320px] mx-auto md:mx-0">
            Your visitors are already interested — now put live chat to work. Start
            conversations with pre-set messages, recommend products, and guide them to
            the ideal purchase.
          </p>
        </div>
        <div
          className="mb-6 hidden md:block max-w-[1120px]"
          style={{ aspectRatio: '8/3' }}
        >
          <div
            id="increase-sales-video"
            data-src="/landingpage/video.webm"
          ></div>
        </div>
        <div className="text-center">
          <Link
            href="/solutions/sales-and-marketing/"
            target="_blank"
            className="inline-flex items-center justify-center px-3 mb-6 md:mb-16 w-full md:w-auto border-2 border-black text-black hover:bg-black hover:text-white transition-colors rounded-lg py-2"
            data-controller="events"
            data-events-event="button"
            data-events-content1="Engage with live chat, sell with ease"
            data-events-content2="Sales boosting tools"
          >
            Sales boosting tools
            <svg
              className="ml-0.5 mt-0"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}