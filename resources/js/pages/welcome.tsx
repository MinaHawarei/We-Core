import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';


export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { props } = usePage();
    const message = props.message as string | undefined;
    const error = props.error as string | undefined;

    return (
        <>

            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            {message && (
                <div className="mb-4 px-4 py-2 bg-green-100 border border-green-400 text-green-700 rounded">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <div className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-6 text-[#1b1b18] dark:bg-[#0a0a0a] transition-colors duration-300">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg
                            bg-[#f4f4f4]
                            p-6 pb-12 text-[13px] leading-[20px]
                            shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.08)]
                            lg:rounded-tl-lg lg:rounded-br-none lg:p-20
                            dark:bg-[#1d1d1d]
                            dark:text-[#EDEDEC]
                            dark:shadow-[inset_0px_0px_0px_1px_#fffaed1a]">
                                    <h1 className="mb-1 font-medium">Welcome to Technical Lab Reservation</h1>
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                                Reserve, manage, and monitor technical lab resources with ease.
                                <br />
                                Start exploring with the tools below.
                            </p>
                            <ul className="mb-4 flex flex-col lg:mb-6">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#1d1d1d]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Step-by-Step Guide
                                        <a
                                            href="https://laravel.com/docs"
                                            target="_blank"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                        >
                                            <span>WIKI</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </a>
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#1d1d1d]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Discover LAB Resources
                                        <a
                                            href="https://laracasts.com"
                                            target="_blank"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                        >
                                            <span>WIKI</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </a>
                                    </span>
                                </li>
                            </ul>
                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <a
                                        href="/reservation"
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        Reserve Now
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
                          <div className="relative flex h-full w-full items-center justify-center">
                            {/* المحتوى الرئيسي */}
                            <div className="flex items-center">

                                {/* اللوجو */}
                                <motion.div
                                initial={{ x: -40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 1.0, type: "spring" }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                >
                                <img
                                    src="/images/we-logo-w.png"
                                    alt="WE Logo"
                                    className="h-24 w-auto transition-all duration-300 hover:rotate-3 hover:scale-105"
                                />
                                </motion.div>

                                {/* الخط العمودي الفاصل */}
                                <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "60px" }}
                                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                                className="mx-4 w-0.5 bg-white"
                                />

                                {/* كلمة Mina */}
                                <motion.span
                                initial={{ x: 40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.5, duration: 1.0, type: "spring" }}
                                className="text-2xl font-bold text-white"
                                >
                                TechLead Team
                                <br />
                                    <span className="text-xs font-normal text-gray-300">
                                        Developed by: Mina Hawarei
                                    </span>
                                </motion.span>
                            </div>

                            </div>

                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
