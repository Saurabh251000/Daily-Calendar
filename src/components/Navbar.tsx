import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

export const Navbar = ({ isAuth }: { isAuth: boolean }) => {
  return (
    <div className="w-full bg-gray-900 text-white opacity-70">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 md:px-16 py-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold flex items-center gap-2">
          <CalendarDays size={36} className="h-6 sm:h-7 md:h-8 lg:h-9" />
          Daily Calendar
        </h1>

        <ul className="hidden md:flex gap-10">
          <Link href="/">
            <li className="hover:text-gray-400">Home</li>
          </Link>

          {!isAuth ? (
            <>
              <Link href="/sign-in">
                <li className="hover:text-gray-400">Login</li>
              </Link>
              <Link href="/sign-up">
                <li className="hover:text-gray-400">Sign Up</li>
              </Link>
            </>
          ) : (
            <>
              <Link href="/user-profile">
                <li className="hover:text-gray-400">Profile</li>
              </Link>
              <li><UserButton afterSignOutUrl="/" /></li>
            </>
          )}
        </ul>

        <ul className="flex md:hidden gap-4 flex-col">
          <Link href="/">
            <li className="hover:text-gray-400">Home</li>
          </Link>

          {!isAuth ? (
            <>
              <Link href="/sign-in">
                <li className="hover:text-gray-400">Login</li>
              </Link>
              <Link href="/sign-up">
                <li className="hover:text-gray-400">Sign Up</li>
              </Link>
            </>
          ) : (
            <>
              <Link href="/user-profile">
                <li className="hover:text-gray-400">Profile</li>
              </Link>
              <li><UserButton afterSignOutUrl="/" /></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const { userId } = await auth();
  const isAuth = !!userId;

  return {
    props: { isAuth },
  };
};
