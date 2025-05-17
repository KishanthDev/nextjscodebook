'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/stores/settingsStore';
import { GreetingSettings } from '@/types/Modifier';

type GreetingProps = {
  showSettingsForm?: boolean;
};

const CloseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
    <path d="M17.4,16l5.3,5.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L16,17.4l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0 c-0.4-0.4-0.4-1,0-1.4l5.3-5.3l-5.3-5.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4,0.4,1-0.4,1.4,0 c0.4,0.4,0.4,1,0,1.4L17.4,16z" />
  </svg>
);

const CustomButton = ({
  text,
  bgColor,
  icon,
  isVisible,
}: {
  text: string;
  bgColor: string;
  icon?: React.ReactNode;
  isVisible: boolean;
}) => {
  if (!isVisible) return null;
  return (
    <li>
      <button
        className="w-full flex justify-center items-center px-4 py-2 text-white rounded-md transition text-sm break-words max-w-full"
        style={{ backgroundColor: bgColor }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {text}
      </button>
    </li>
  );
};

const GreetingImage = ({ src, alt, fallbackSrc }: { src: string; alt: string; fallbackSrc: string }) => (
  <div className="flex">
    <Image
      src={src || fallbackSrc}
      alt={alt}
      width={230}
      height={150}
      className="object-cover w-full"
      onError={(e) => {
        e.currentTarget.src = fallbackSrc;
      }}
    />
  </div>
);

function GreetingContent({ showSettingsForm = false }: GreetingProps) {
  const defaultSettings: GreetingSettings = {
    headingColor: '#333333',
    paraColor: '#666666',
    primaryBtnColor: '#f97316',
    secondaryBtnColor: '#000000',
    headingText: 'Welcome to LiveChat!',
    paraText: 'Sign up free or talk with our product experts',
    imageUrl: '/landingpage/hello01.png',
    primaryBtnText: 'Primary',
    secondaryBtnText: 'Secondary',
    showPrimaryBtn: true,
    showSecondaryBtn: true,
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, loading, fetchSettings } = useSettingsStore();

  const greetingSettings: GreetingSettings = {
    ...defaultSettings,
    ...settings.greeting,
  };

  useEffect(() => {
    setMounted(true);
    console.log('Fetching greeting settings...');
    fetchSettings('greeting', defaultSettings);
  }, [fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  if (loading || !settings.greeting) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="flex justify-center items-center p-6">
          <div className="relative w-[230px] mx-auto">
            <div className="absolute -top-7 right-0">
              <Skeleton width={24} height={24} circle />
            </div>
            <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
              <Skeleton width={230} height={150} />
              <div className="p-3.5 space-y-2">
                <Skeleton width={180} height={20} />
                <Skeleton width={200} height={16} />
              </div>
              <div className="px-2 pb-2 pt-[7px] space-y-2">
                <Skeleton width={206} height={40} borderRadius={6} />
                <Skeleton width={206} height={40} borderRadius={6} />
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center">
        <div
          className="relative w-[230px] mx-auto group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`absolute -top-7 right-0 z-20 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button aria-label="Hide greeting" style={{ color: greetingSettings.headingColor }}>
              <CloseIcon />
            </button>
          </div>

          <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
            <GreetingImage
              src={greetingSettings.imageUrl}
              alt="Hello"
              fallbackSrc="/landingpage/hello01.png"
            />

            <div className="p-3.5 text-sm leading-snug break-words max-w-full overflow-hidden">
              <h2
                className="mb-2 font-semibold"
                style={{ color: greetingSettings.headingColor }}
              >
                {greetingSettings.headingText}
              </h2>
              <p style={{ color: greetingSettings.paraColor }}>
                {greetingSettings.paraText}
              </p>
            </div>

            <ul className="flex flex-col gap-2 px-2 pb-2 pt-[7px]">
              <CustomButton
                text={greetingSettings.primaryBtnText}
                bgColor={greetingSettings.primaryBtnColor}
                isVisible={greetingSettings.showPrimaryBtn}
              />
              <CustomButton
                text={greetingSettings.secondaryBtnText}
                bgColor={greetingSettings.secondaryBtnColor}
                icon={<span>💬</span>}
                isVisible={greetingSettings.showSecondaryBtn}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Greeting() {
  const showSettingsForm = false;
  return <GreetingContent showSettingsForm={showSettingsForm} />;
}