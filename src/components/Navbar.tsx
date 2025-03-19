'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { User } from 'next-auth'
import { Button } from './ui/button'

export default function Navbar() {

    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">

            {/* for large devices */}

            <div className="hidden container mx-auto sm:flex sm:flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold mb-4 sm:mb-0">
                    Faceless Message
                </Link>
                {
                    session ? (
                        <>
                            <span className="mr-4">Welcome, {user.username || user.email}</span>
                            <Button onClick={() => signOut()}
                                className="w-auto bg-white text-black hover:bg-white hover:text-black"
                            >Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in">
                                <Button
                                    className="w-auto  bg-white text-black hover:bg-white hover:text-black"
                                >Login</Button>
                            </Link>
                        </>
                    )
                }
            </div>

            {/* for small devices */}
            <div>
                <div className="flex container mx-auto sm:hidden justify-between items-start">
                    <Link href="/" className="text-lg font-bold mb-4">
                    Faceless Message
                    </Link>
                    {
                        session ? (
                            <>
                                <Button onClick={() => signOut()}
                                    className="w-16 bg-white text-black hover:bg-white hover:text-black"
                                >Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button
                                        className="w-16 bg-white text-black hover:bg-white hover:text-black"
                                    >Login</Button>
                                </Link>
                            </>
                        )
                    }

                </div>

                {session && (
                    <div className='sm:hidden text-center'>
                        <span className="mr-4">Welcome, {
                            session ?
                                user.username || user.email
                                : ""
                        }</span>
                    </div>
                )}
            </div>
        </nav>
    )

}