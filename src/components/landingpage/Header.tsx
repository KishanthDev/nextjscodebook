'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../../registry/new-york-v4/ui/navigation-menu';
import { Button } from '@/registry/new-york-v4/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[90px] justify-between items-center py-4">
          {/* Logo and Product Dropdown */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <Image
                src="https://www.livechat.com/lc-powered-by-logo.59e4207fd8afaeef387d20bfdb42958c49652808777bfbc227d1d69247059393.svg"
                alt="LiveChat logo"
                width={134}
                height={40}
              />
            </Link>

            {/* Desktop Product Dropdown with shadcn Navigation Menu */}
            <NavigationMenu className="hidden lg:block">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-lg  text-black hover:text-gray-600">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-4 w-[600px]">
                      <div className="space-y-2 p-8">
                        <Link
                          href="/tour"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Product Tour
                          <span className="block text-sm text-gray-500">
                            Feel the LiveChat® experience
                          </span>
                        </Link>
                        <Link
                          href="/features"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Features
                          <span className="block text-sm text-gray-500">
                            Everything you need
                          </span>
                        </Link>
                        <Link
                          href="/features/channels"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Channels
                          <span className="block text-sm text-gray-500">
                            Be where your customers are
                          </span>
                        </Link>
                      </div>
                      <div className="space-y-2 p-8">
                        <p className="px-4 py-2 text-sm font-semibold text-gray-900">
                          Solutions
                        </p>
                        <Link
                          href="/solutions/customer-support"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Customer Support
                        </Link>
                        <Link
                          href="/solutions/sales-and-marketing"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Sales & Marketing
                        </Link>
                        <Link
                          href="/enterprise"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Enterprise
                        </Link>
                      </div>
                    </div>
                    <Link
                      href="/app"
                      className="block text-center px-4 py-2 text-blue-600 hover:bg-gray-100 rounded-md"
                    >
                      Get LiveChat® App
                    </Link>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href="https://my.livechatinc.com"
              className="px-4 py-1 text-lg font-bold text-black  border border-white rounded-sm hover:bg-gray-200"
            >
              Log in
            </Link>
            <Link
              href="https://accounts.livechat.com/signup"
              className="px-4 py-1 text-lg font-bold text-black border border-black rounded-sm hover:bg-red-500 hover:text-white"
            >
              Sign up free
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <nav className="flex flex-col py-4 space-y-2">
              {/* Product */}
              <div>
                <button className="flex items-center w-full text-gray-700 hover:text-gray-900">
                  Product
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="pl-4 mt-2 space-y-2">
                  <Link
                    href="/tour"
                    className="block text-gray-700 hover:text-gray-900"
                  >
                    Product Tour
                    <span className="block text-sm text-gray-500">
                      Feel the LiveChat® experience
                    </span>
                  </Link>
                  <Link
                    href="/features"
                    className="block text-gray-700 hover:text-gray-900"
                  >
                    Features
                    <span className="block text-sm text-gray-500">
                      Everything you need
                    </span>
                  </Link>
                  <Link
                    href="/features/channels"
                    className="block text-gray-700 hover:text-gray-900"
                  >
                    Channels
                    <span className="block text-sm text-gray-500">
                      Be where your customers are
                    </span>
                  </Link>
                  <p className="text-sm font-semibold text-gray-900">
                    Solutions
                  </p>
                  <Link
                    href="/solutions/customer-support"
                    className="block text-gray-700 hover:text-gray-900"
                  >
                    Customer Support
                  </Link>
                  <Link
                    href="/solutions/sales-and-marketing"
                    className="block text-gray-700 hover:text-gray-900"
                  >
                    Sales & Marketing
                  </Link>
                  <Link
                    href="/enterprise"
                    className="block text-gray-700 hover:text-gray-900"
                  >
                    Enterprise
                  </Link>
                  <Link
                    href="/app"
                    className="block text-blue-600 hover:text-blue-700"
                  >
                    Get LiveChat® App
                  </Link>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="border-t pt-4 mt-4">
                <form
                  action="https://accounts.livechat.com/signup"
                  method="GET"
                  className="flex mb-4"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="flex-1 p-2 border border-gray-400 rounded-l"
                    required
                  />
                  <Button
                    variant="destructive"
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r"
                  >
                    Sign up free
                  </Button>
                </form>
                <p className="text-center">
                  Already a customer?{' '}
                  <Link
                    href="https://my.livechatinc.com"
                    className="text-blue-600"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}