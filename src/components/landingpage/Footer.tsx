'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '../../registry/new-york-v4/ui/navigation-menu';
import { cn } from '@/lib/utils';

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-black">
            {/* App Downloads and Navigation */}
            <div className="border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* App Download Links */}
                    <div className="flex flex-wrap items-center mb-6">
                        <p className="text-xs font-bold flex-1 min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] mb-3 text-black">
                            Get LiveChat® App
                        </p>
                        <p className="flex-1 min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] mb-3">
                            <Link href="/app/livechat-web-app/" className="flex items-center text-xs text-black hover:text-gray-700">
                                <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="currentColor" fillRule="evenodd">
                                        <path d="M7.57 14.51c1.12-.15 2.1-1.31 2.72-3.03-.9-.2-1.8-.3-2.72-.31v3.34zM9.36 14.24l.2-.06.16-.05.19-.07.16-.07.19-.07a7.87 7.87 0 0 0 1.6-.97l.15-.11.15-.14.13-.11.15-.15.13-.12.02-.02a8.81 8.81 0 0 0-1.8-.69 6.44 6.44 0 0 1-1.66 2.7l.06-.02.17-.05zM14.62 7.52h-3.13a13.4 13.4 0 0 1-.53 3.6c.69.18 1.35.44 1.98.78a7.23 7.23 0 0 0 1.68-4.38zM7.57 7h3.4a12.92 12.92 0 0 0-.52-3.46c-.95.21-1.91.33-2.88.34V7zM7.57.01v3.35c.91-.01 1.82-.12 2.72-.32C9.67 1.33 8.69.17 7.57.01zM7.57 10.65c.97 0 1.93.12 2.88.34.33-1.13.5-2.3.51-3.47H7.57v3.13zM12.94 2.62c-.63.34-1.3.6-1.98.79.34 1.17.51 2.38.53 3.6h3.13a7.23 7.23 0 0 0-1.68-4.39zM12.59 2.23l-.02-.02-.13-.13-.15-.14-.13-.12-.15-.13-.14-.11a5.59 5.59 0 0 0-.94-.63 7.23 7.23 0 0 0-.17-.1L10.6.77a5.78 5.78 0 0 0-.34-.16l-.19-.08a7.38 7.38 0 0 0-.72-.25L9.2.24 9.13.22a6.44 6.44 0 0 1 1.67 2.7 8.8 8.8 0 0 0 1.79-.69zM0 7h3.13c.01-1.21.2-2.42.53-3.6a9.1 9.1 0 0 1-1.98-.78A7.23 7.23 0 0 0 0 7zM7.05 14.51v-3.34c-.92 0-1.82.12-2.72.31.62 1.72 1.6 2.88 2.72 3.03zM7.05 7.52h-3.4c.02 1.18.2 2.34.52 3.47.94-.22 1.9-.33 2.88-.34V7.52zM7.05.01c-1.12.16-2.1 1.32-2.72 3.03.9.2 1.8.3 2.72.32V0zM7.05 3.88c-.97-.01-1.94-.13-2.88-.34-.33 1.12-.5 2.29-.51 3.46h3.39V3.88zM5.49.22l-.06.02-.17.04-.2.06L4.9.4l-.2.07-.15.06-.19.08a7.57 7.57 0 0 0-.82.42l-.17.1a6.85 6.85 0 0 0-.46.32l-.16.13-.14.1-.15.14-.13.12-.15.14-.13.13-.02.02c.57.3 1.17.52 1.8.68C4.13 1.9 4.71.97 5.48.22zM2.18 12.44l.15.14.13.12.15.14.14.1.16.13.14.1a7.4 7.4 0 0 0 .81.5l.16.09a6.08 6.08 0 0 0 .34.16l.19.07a7.38 7.38 0 0 0 .35.14l.17.05.2.06.16.05.06.01a6.44 6.44 0 0 1-1.67-2.7 8.8 8.8 0 0 0-1.79.7l.02.02.13.12zM1.68 11.9c.62-.34 1.3-.6 1.98-.78a13.4 13.4 0 0 1-.53-3.6H0c.06 1.6.65 3.15 1.68 4.38z" />
                                    </g>
                                </svg>
                                <span className="ml-1">Web browser</span>
                            </Link>
                        </p>
                        <p className="flex-1 min-w-[30%] sm:min-w-[10.33%] lg:min-w-[10.67%] mb-3">
                            <Link href="/app/livechat-for-windows/" className="flex items-center text-xs text-black hover:text-gray-700">
                                <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="currentColor" fillRule="evenodd">
                                        <path d="M0 12.5l6 .8V7.7H0zM0 6.9h6V1.2L0 2zM6.7 13.4l7.9 1.1V7.7H6.7zM6.8 1.1v5.7h7.7V0z" />
                                    </g>
                                </svg>
                                <span className="ml-1">Windows</span>
                            </Link>
                        </p>
                        <p className="flex-1 min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] mb-3">
                            <Link href="/app/livechat-for-android/" className="flex items-center text-xs text-black hover:text-gray-700">
                                <svg width="15" height="18" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="currentColor" fillRule="evenodd">
                                        <path d="M1.08 5.58h-.05C.47 5.58 0 6.04 0 6.6v4.44c0 .57.47 1.02 1.03 1.02h.05c.56 0 1.03-.46 1.03-1.02V6.6c0-.56-.47-1.02-1.03-1.02zM2.6 12.76c0 .51.42.93.94.93h1.01v2.4c0 .57.47 1.02 1.03 1.02h.05c.57 0 1.03-.46 1.03-1.02v-2.4h1.41v2.4c0 .57.46 1.02 1.03 1.02h.04c.57 0 1.03-.46 1.03-1.02v-2.4h1.01c.52 0 .95-.42.95-.93V5.74H2.6v7.02z" />
                                        <path d="M9.74 1.49l.8-1.23a.17.17 0 0 0-.05-.23.17.17 0 0 0-.24.05l-.83 1.27a5.46 5.46 0 0 0-4.11 0L4.48.08a.17.17 0 0 0-.24-.05.17.17 0 0 0-.05.23l.8 1.23a4.03 4.03 0 0 0-2.4 3.83h9.56l.01-.28c0-1.52-.98-2.85-2.42-3.55zm-4.6 2.2a.46.46 0 0 1-.45-.46c0-.25.2-.45.46-.45a.46.46 0 1 1 0 .91zm4.44 0a.46.46 0 0 1-.46-.46c0-.25.2-.45.46-.45a.46.46 0 1 1 0 .91z" fillRule="nonzero" />
                                        <path d="M13.7 5.58h-.05c-.56 0-1.03.46-1.03 1.02v4.44c0 .57.47 1.02 1.03 1.02h.05c.56 0 1.02-.46 1.02-1.02V6.6c0-.56-.46-1.02-1.03-1.02z" />
                                    </g>
                                </svg>
                                <span className="ml-1">Android</span>
                            </Link>
                        </p>
                        <p className="flex-1 min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] mb-3">
                            <Link href="/app/livechat-for-iphone/" className="flex items-center text-xs text-black hover:text-gray-700">
                                <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.6 13.9l-1 1.5a1.2 1.2 0 01-2-1.1l.7-1.2c.2-.2.5-.5 1-.4 0 0 1.3 0 1.4.8l-.1.4zM17 10H13.9L11 4.8l-.2-.3c-.3-.4-.7.7-.7.7-.6 1.2 0 2.7.3 3l4 7.1a1.2 1.2 0 002-1.1l-1-1.8s0-.2.2-.2H17c.6 0 1.1-.5 1.1-1.1 0-.6-.5-1.2-1.1-1.2zm-5.3 1.6s.1.7-.5.7h-10a1.2 1.2 0 010-2.3h2.5c.5 0 .6-.2.6-.2l3.4-5.9v-.2l-1.2-2a1.2 1.2 0 012-1.1l.6.9.5-1a1.2 1.2 0 012 1.2L6.9 10l.1.1h2.8s1.6 0 1.9 1.6z" fill="currentColor" />
                                </svg>
                                <span className="ml-1">iOS</span>
                            </Link>
                        </p>
                        <p className="flex-1 min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] mb-3">
                            <Link href="/app/livechat-for-mac/" className="flex items-center text-xs text-black hover:text-gray-700">
                                <svg width="15" height="18" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="currentColor" fillRule="evenodd">
                                        <path d="M12.4 9.3c0-2.2 1.8-3.3 1.9-3.3a4.1 4.1 0 0 0-3.2-1.8c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.7-3-.7-1.4 0-2.8.8-3.6 2.2C-.5 9.2.7 13 2.2 15.3c.8 1 1.7 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7 1.3 0 1.6.7 2.8.7 1.2 0 2-1 2.7-2.1.9-1.3 1.2-2.5 1.3-2.5 0 0-2.4-1-2.4-3.6zM10.2 2.8c.6-.7 1-1.8.9-2.8a4 4 0 0 0-2.6 1.3C7.9 2 7.4 3 7.5 4c1 .1 2-.5 2.7-1.2z" />
                                    </g>
                                </svg>
                                <span className="ml-1">Mac</span>
                            </Link>
                        </p>
                    </div>

                    {/* Navigation Sections */}
                    <nav className="flex flex-wrap mb-8">
                        <div className="min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] pr-2 mb-4">
                            <p className="text-xs font-bold text-black mb-2">Product</p>
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col items-start justify-start space-y-2">
                                    {[
                                        { href: '/pricing/', label: 'Pricing' },
                                        { href: '/benefits/', label: 'LiveChat® Benefits' },
                                        { href: '/tour/', label: 'Tour' },
                                        { href: '/features/', label: 'Features' },
                                        { href: '/lead-generation/', label: 'Lead Generation' },
                                        { href: '/livechat-demo/', label: 'Product Demo' },
                                        { href: '/app/', label: 'App' },
                                        { href: '/marketplace/', label: 'Marketplace' },
                                        { href: 'https://news.livechat.com/en/', label: 'News', external: true },
                                    ].map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="text-xs text-black hover:text-gray-700 block"
                                                {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
                                            >
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Solutions */}
                        <div className="min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] pr-2 mb-4">
                            <p className="text-xs font-bold text-black mb-2">Solutions</p>
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col items-start justify-start space-y-2">
                                    {[
                                        { href: '/solutions/customer-support/', label: 'Customer Support' },
                                        { href: '/solutions/sales-and-marketing/', label: 'Sales & Marketing' },
                                        { href: '/enterprise/', label: 'Enterprise' },
                                    ].map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            <Link href={item.href} className="text-xs text-black hover:text-gray-700 block">
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Customers */}
                        <div className="min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] pr-2 mb-4">
                            <p className="text-xs font-bold text-black mb-2">Customers</p>
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col items-start justify-start space-y-2">
                                    {[
                                        { href: '/customers/#industries', label: 'Industries' },
                                        { href: '/customers/', label: 'Customers' },
                                        { href: '/customers/live-chat-reviews/', label: 'Reviews & Testimonials' },
                                        { href: '/customers/customer-stories/', label: 'Case Studies' },
                                    ].map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            <Link href={item.href} className="text-xs text-black hover:text-gray-700 block">
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Resources */}
                        <div className="min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] pr-2 mb-4">
                            <p className="text-xs font-bold text-black mb-2">Resources</p>
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col items-start justify-start space-y-2">
                                    {[
                                        { href: '/success/', label: 'Success by LiveChat®', external: true },
                                        { href: '/success/customer-service-guide/', label: 'Customer Service Guide', external: true },
                                        { href: '/customer-service-report/', label: 'Customer Service Report' },
                                        { href: '/benchmark/', label: 'Benchmark' },
                                        { href: '/resources/reports/', label: 'Reports' },
                                        { href: '/typing-speed-test/', label: 'Typing Speed Test' },
                                        { href: '/privacy-policy-generator/', label: 'Privacy Policy Generator' },
                                        { href: '/newsletter/', label: 'Newsletter' },
                                    ].map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="text-xs text-black hover:text-gray-700 block"
                                                {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
                                            >
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Support */}
                        <div className="min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.44%] pr-2 mb-4">
                            <p className="text-xs font-bold text-black mb-2">Support</p>
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col items-start justify-start space-y-2">
                                    {[
                                        { href: '/help/', label: 'Help Center' },
                                        { href: '/webinars/', label: 'Webinars' },
                                        { href: '/marketplace/partners/', label: 'Partners Marketplace' },
                                        { href: '/enterprise/professional-business-services/', label: 'Professional Services' },
                                        { href: 'https://platform.text.com/', label: 'API & Developers', external: true },
                                        { href: 'https://status.livechat.com/', label: 'System Status', external: true },
                                    ].map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="text-xs text-black hover:text-gray-700 block"
                                                {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
                                            >
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Company */}
                        <div className="min-w-[50%] sm:min-w-[33.33%] lg:min-w-[16.67%] pr-2 mb-4">
                            <p className="text-xs font-bold text-black mb-2">Company</p>
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col items-start justify-start space-y-2">
                                    {[
                                        { href: 'https://text.com/?utm_source=livechat.com&utm_medium=referral&utm_content=footer', label: 'About Text', external: true },
                                        { href: '/contact/', label: 'Contact' },
                                        { href: 'https://text.com/team/', label: 'Team' },
                                        { href: '/careers/', label: 'Careers', external: true },
                                        { href: 'https://investor.text.com/', label: 'Investor Relations', external: true },
                                        { href: 'https://www.text.com/press/', label: 'Press' },
                                        { href: 'https://partners.livechat.com/?utm_source=livechat.com&utm_medium=referral&utm_content=footer', label: 'Partner Program', external: true },
                                        { href: 'https://incubator.text.com/?utm_source=livechat&utm_medium=referral&utm_content=footer', label: 'LiveChat® Incubator', external: true },
                                        { href: '/legal/', label: 'Legal' },
                                    ].map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="text-xs text-black hover:text-gray-700 block"
                                                {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
                                            >
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </nav>

                    {/* CTA and Social Links */}
                    <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-6">
                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center flex-col md:flex-row mb-4 lg:mb-1">
                            <p className="text-sm font-bold text-black mb-3 md:mb-0 md:mr-4">
                                Start your free live chat trial
                            </p>
                            <Link
                                href="https://accounts.livechat.com/signup?source_id=footer_cta_button&source_type=website&source_url=https%3A%2F%2Fwww.livechat.com%2F&utm_source=PP&utm_medium=link&utm_campaign=pp_10off&utm_term=1-g-Cj0KCQjw8cHABhC-ARIsAJnY12xUzSCGtPx1EeNvnYNy0DYue-7gCrv_0Mq0wBrVEV6KrZ7bgPtsOowaAtUhEALw_wcB&landing_page=https%3A%2F%2Fwww.livechat.com%2F&partner_id=PVDCS9SU0D"
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                                Sign up free
                            </Link>
                        </div>

                        {/* Mobile CTA */}
                        <div className="md:hidden flex flex-col items-center mb-6">
                            <p className="text-sm font-bold text-white mb-3">
                                Start your free live chat trial
                            </p>
                            <Link
                                href="https://accounts.livechat.com/signup?source_id=footer_cta_button&source_type=website&source_url=https%3A%2F%2Fwww.livechat.com%2F&utm_source=PP&utm_medium=link&utm_campaign=pp_10off&utm_term=1-g-Cj0KCQjw8cHABhC-ARIsAJnY12xUzSCGtPx1EeNvnYNy0DYue-7gCrv_0Mq0wBrVEV6KrZ7bgPtsOowaAtUhEALw_wcB&landing_page=https%3A%2F%2Fwww.livechat.com%2F&partner_id=PVDCS9SU0D"
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 w-full max-w-xs"
                            >
                                Sign up free
                            </Link>
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-lg mx-auto lg:mr-0">
                            {[
                                { href: 'https://twitter.com/intent/follow?screen_name=LiveChat', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="currentColor" d="M18.2 2.3h3.3l-7.2 8.2 8.5 11.3H16L11 14.8l-6 6.8H1.6L9.4 13 1.2 2.2H8l4.8 6.3 5.4-6.3ZM17 19.8H19L7 4H5l12 15.7Z" /></svg>, label: 'Twitter' },
                                { href: 'https://www.linkedin.com/company/livechat/', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20.45 20.45H16.9v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM3.55 20.45h3.57V9H3.55v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" fill="currentColor" /></svg>, label: 'LinkedIn' },
                                { href: 'https://www.facebook.com/livechat', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.07a12 12 0 1 0-13.88 11.86v-8.39H7.08v-3.47h3.04V9.43c0-3 1.8-4.67 4.54-4.67 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.5 0-1.96.92-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.39A12 12 0 0 0 24 12.07Z" fill="currentColor" /></svg>, label: 'Facebook' },
                                { href: 'https://www.youtube.com/livechat?sub_confirmation=1', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.52 15.59V8.82l6.49 3.4-6.49 3.37Zm14.24-7.94s-.23-1.66-.95-2.39c-.92-.96-1.94-.96-2.4-1.02C17.03 4 12 4 12 4h-.02s-5.03 0-8.4.24c-.46.06-1.48.06-2.4 1.02-.72.73-.95 2.4-.95 2.4S0 9.6 0 11.54v1.82c0 1.95.24 3.9.24 3.9s.23 1.66.95 2.39c.92.96 2.12.93 2.65 1.03 1.92.18 8.16.24 8.16.24s5.04 0 8.4-.25c.47-.06 1.5-.06 2.4-1.02.73-.73.96-2.39.96-2.39s.24-1.95.24-3.9v-1.82c0-1.95-.24-3.9-.24-3.9Z" fill="currentColor" /></svg>, label: 'YouTube' },
                                { href: 'https://www.instagram.com/livechat/', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.05.07C8.33.01 8.75 0 12 0c3.26 0 3.67.01 4.95.07a8.8 8.8 0 0 1 2.91.56c.79.3 1.46.72 2.13 1.38a5.88 5.88 0 0 1 1.38 2.13c.3.76.5 1.64.56 2.91.06 1.28.07 1.7.07 4.95 0 3.26-.01 3.67-.07 4.95a8.81 8.81 0 0 1-.56 2.91c-.3.79-.72 1.46-1.38 2.13a5.88 5.88 0 0 1-2.13 1.38c-.76.3-1.64.5-2.91.56-1.28.06-1.7.07-4.95.07-3.26 0-3.67-.01-4.95-.07a8.8 8.8 0 0 1-2.91-.56A5.88 5.88 0 0 1 2 21.99a5.88 5.88 0 0 1-1.38-2.13 8.8 8.8 0 0 1-.56-2.91A85.13 85.13 0 0 1 0 12c0-3.26.01-3.67.07-4.95a8.8 8.8 0 0 1 .56-2.91c.3-.79.72-1.46 1.38-2.13A5.88 5.88 0 0 1 4.14.63 8.8 8.8 0 0 1 7.05.07Zm12.03 2.58a6.64 6.64 0 0 0-2.23-.42A83.27 83.27 0 0 0 12 2.16c-3.2 0-3.58.01-4.85.07-1.17.06-1.8.25-2.23.42-.56.21-.96.47-1.38.9-.42.41-.68.81-.9 1.37a6.64 6.64 0 0 0-.4 2.23A83.28 83.28 0 0 0 2.15 12c0 3.2.01 3.58.07 4.85.06 1.17.25 1.8.42 2.23.21.56.47.96.9 1.38.41.42.81.68 1.37.9.43.16 1.06.35 2.23.4 1.27.07 1.65.08 4.85.08 3.2 0 3.58-.01 4.85-.07a6.64 6.64 0 0 0 2.23-.42c.56-.21.96-.47 1.38-.9.42-.41.68-.81.9-1.37.16-.43.35-1.06.4-2.23.07-1.27.08-1.65.08-4.85 0-3.2-.01-3.58-.07-4.85a6.64 6.64 0 0 0-.42-2.23 3.72 3.72 0 0 0-.9-1.38 3.72 3.72 0 0 0-1.37-.9ZM12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm10.4-4.97a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88Z" fill="currentColor" /></svg>, label: 'Instagram' },
                                { href: 'https://www.producthunt.com/posts/livechat-2', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.1999 14.4001h3.3998c2.3197 0 4.2-1.8803 4.2-4.2 0-2.31977-1.8803-4.20002-4.2-4.20002H7.79993V18.0001h2.39997v-3.6ZM0 12C0 5.37225 5.37225 0 12 0c6.627 0 12 5.37225 12 12 0 6.6278-5.373 12-12 12-6.62775 0-12-5.3722-12-12Zm10.2-3.60004h3.3998c.9946 0 1.8001.80625 1.8001 1.80004 0 .9937-.8055 1.7999-1.8001 1.7999H10.2V8.39996Z" fill="currentColor" /></svg>, label: 'Product Hunt' },
                                { href: 'https://dribbble.com/textcom', icon: <svg width="24" height="24" viewBox="0 0 24 國家24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19.93 5.53c-.21.3-1.93 2.5-5.72 4.05a30.73 30.73 0 0 1 .9 2c3.41-.42 6.8.27 7.14.34a10.2 10.2 0 0 0-2.32-6.39ZM9.6 2.05a54.8 54.8 0 0 1 3.82 6c3.65-1.37 5.19-3.44 5.38-3.7a10.2 10.2 0 0 0-9.2-2.3ZM1.97 9.92c.46 0 4.68.02 9.47-1.25a65.4 65.4 0 0 0-3.8-5.93c-2.86 1.35-5 4-5.67 7.18Zm2.42 8.95c.23-.4 3.04-5.06 8.33-6.76l.4-.13c-.26-.58-.54-1.16-.83-1.74A37.83 37.83 0 0 1 1.76 11.7l-.01.32c0 2.63 1 5.03 2.64 6.85ZM16 21.45c-.15-.9-.74-4.03-2.18-7.77l-.07.02c-5.78 2.01-7.86 6.02-8.04 6.4A10.2 10.2 0 0 0 16 21.45Zm6.12-7.8c-.35-.12-3.17-.96-6.38-.45a44.2 44.2 0 0 1 1.99 7.31 10.27 10.27 0 0 0 4.39-6.87ZM12 24C5.38 24 0 18.62 0 12S5.38 0 12 0s12 5.38 12 12-5.38 12-12 12Z" fill="currentColor" /></svg>, label: 'Dribbble' },
                                { href: 'https://github.com/livechat', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.39 6.13a12.1 12.1 0 0 0-4.37-4.48A11.52 11.52 0 0 0 12 0C9.82 0 7.81.55 5.98 1.65A12.27 12.27 0 0 0 0 12.3c0 2.68.76 5.1 2.29 7.23a11.78 11.78 0 0 0 5.91 4.45c.28.05.5.01.63-.12.13-.12.2-.28.2-.48a378 378 0 0 0-.01-2.29l-.36.07a6.45 6.45 0 0 1-1.95-.06 2.4 2.4 0 0 1-1.05-.48 2.03 2.03 0 0 1-.7-.98l-.15-.37c-.1-.25-.27-.52-.49-.82a1.9 1.9 0 0 0-.68-.6l-.1-.09a1.16 1.16 0 0 1-.35-.41c-.03-.08 0-.14.08-.19a1 1 0 0 1 .45-.07l.31.05c.2.04.47.17.77.38.31.22.56.5.76.83.24.44.53.78.87 1 .34.24.68.35 1.02.35.35 0 .64-.03.9-.08.24-.05.48-.13.7-.24.09-.72.35-1.27.76-1.65-.6-.06-1.13-.16-1.6-.29a6.3 6.3 0 0 1-1.47-.62 4.23 4.23 0 0 1-2.08-2.76c-.21-.7-.32-1.5-.32-2.4 0-1.3.42-2.4 1.24-3.3a4.4 4.4 0 0 1 .1-3.27c.3-.1.76-.02 1.35.22A9.29 9.29 0 0 1 9 6.36a10.84 10.84 0 0 1 6 0l.6-.39c.4-.25.88-.49 1.43-.7.55-.21.98-.27 1.27-.18.47 1.21.5 2.3.12 3.27.82.9 1.24 2 1.24 3.3 0 .9-.11 1.71-.32 2.41a5 5 0 0 1-.83 1.68 4.4 4.4 0 0 1-1.27 1.07c-.5.29-1 .5-1.47.62-.47.13-1 .23-1.6.29.54.48.81 1.24.81 2.27v3.38c0 .2.07.36.2.48.13.13.34.17.62.12 2.41-.83 4.39-2.3 5.91-4.45A12.16 12.16 0 0 0 24 12.3c0-2.23-.54-4.29-1.61-6.17Z" fill="currentColor" /></svg>, label: 'GitHub' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-black hover:text-gray-700"
                                    aria-label={`Link to ${item.label} page`}
                                    target="_blank"
                                    rel="noopener"
                                >
                                    {item.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Text */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <p className="text-[0.625rem] mb-3">
                    LiveChat® is the best AI live chat software for business, designed for B2B SaaS companies and{' '}
                    <Link href="/solutions/ecommerce/" className="underline text-black hover:text-gray-700">
                        ecommerce
                    </Link>{' '}
                    stores. This powerful customer service software helps you connect with customers, provide real-time support, and drive sales across multiple communication channels. If you’re looking for the best live chat software for website engagement and customer satisfaction, LiveChat® will help you grow your business.
                    <br />
                    Copyright © 2025 Text, Inc. All rights reserved.
                </p>
                <p className="text-[0.625rem]">
                    We use cookies and similar technologies to enhance your interactions with our website and Services, including when you reach out to us on chat. This comprises traffic analysis, delivering personalized content, and supporting our marketing efforts. By accessing our website, interacting with our Services, you agree to let us and our partners employ cookies and similar technologies on your computer or devices. Click the{' '}
                    <Link href="/legal/cookies-policy/" className="font-bold text-black hover:text-gray-700">
                        Cookies Policy
                    </Link>{' '}
                    to check how you can control the use of them through your device. To understand how we process your data, including through cookies, and different forms of interactions with us, please read our{' '}
                    <Link href="/legal/privacy-policy/" className="font-bold text-black hover:text-gray-700">
                        Privacy Policy
                    </Link>.
                </p>
            </div>
        </footer>
    );
}