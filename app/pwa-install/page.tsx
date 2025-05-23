import Link from "next/link";
import Image from "next/image";

export default function PwaInstallPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Install Calendarix on your device</h1>

        <div className="space-y-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">iOS Installation</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Open Safari and visit this website</li>
              <li>Tap the Share button <span className="inline-block w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </span></li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
              <li>Tap <strong>Add</strong> in the top right corner</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Android Installation</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Open Chrome and visit this website</li>
              <li>Tap the three dots menu ⋮ in the top right</li>
              <li>Tap <strong>Add to Home screen</strong></li>
              <li>Tap <strong>Add</strong> when prompted</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Benefits of Installing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access Calendarix directly from your home screen</li>
              <li>Use the app offline when you don&apos;t have internet</li>
              <li>Faster loading experience</li>
              <li>Get push notifications (where enabled)</li>
              <li>Full-screen experience without browser controls</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to App
          </Link>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Install Calendarix App | Installation Guide",
  description: "Learn how to install Calendarix as an app on your iOS or Android device for the best experience."
}
