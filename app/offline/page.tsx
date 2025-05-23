import Link from "next/link";
import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-4 mx-auto w-24 h-24 relative">
          <Image
            src="/icons/offline.svg"
            alt="Offline"
            width={96}
            height={96}
            className="object-contain text-gray-700 dark:text-gray-300"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">You&apos;re offline</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          It seems you&apos;re not connected to the internet. Some features may be unavailable until you reconnect.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Offline | Calendarix",
  description: "You are currently offline."
}
