'use client';

import { useState } from 'react';
import Header from '@/components/landingpage/Header';
import Footer from '@/components/landingpage/Footer';
import Hero1 from '@/components/landingpage/Hero1';
import Preview from '@/components/landingpage/Preview';
import Hero2 from '@/components/landingpage/Hero2';
import EngageSection from '@/components/landingpage/EngageSection';
import Bubble from '@/app/(app)/bubble/page';

function Page() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      <Header />
      <div className="border-b rounded-4xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <Hero1 />
      </div>
      <div className="my-10">
        <Preview />
      </div>
      <EngageSection />
      <Hero2 />
      <Footer />
      {/* Floating Chat UI */}
      <div>
        {/* Bubble toggle button - bottom right */}
        <div
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
        >
          <Bubble />
        </div>
      </div>

    </div>
  );
}

export default Page;
