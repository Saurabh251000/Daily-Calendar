import Link from "next/link";
// import { SignInButton, SignedIn, SignedOut, UserButton, SignUpButton } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";
import { CalendarDays } from 'lucide-react';

export const Navbar = async () => {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="flex justify-between items-center px-16 py-3 bg-gray-900 text-white opacity-70">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        <CalendarDays size={36}/>
        Daily Calendar
      </h1>
      <ul className="flex gap-10">
        <Link href="/">
          <li>Home</li>
        </Link>

        {!isAuth ? (
          <>
            <Link href="/sign-in">
              <li>Login</li>
            </Link>
            <Link href="/sign-up">
              <li>Sign Up</li>
            </Link>
          </>
        ) : (
          <>
            <Link href="/user-profile">
              <li>Profile</li>
            </Link>
            <li><UserButton afterSignOutUrl="/" /></li>
          </>
        )}
      </ul>
    </div>
  );
};
