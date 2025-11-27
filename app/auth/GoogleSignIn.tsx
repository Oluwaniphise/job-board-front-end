import { PiGoogleLogo } from "react-icons/pi";

export const GoogleSignIn: React.FC = () => {
  const GOOGLE_AUTH_URL = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;

  return (
    <>
      <a
        href={GOOGLE_AUTH_URL}
        className="inline-flex gap-2 items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
      <PiGoogleLogo />
        Continue with Google
      </a>
    </>
  );
};
