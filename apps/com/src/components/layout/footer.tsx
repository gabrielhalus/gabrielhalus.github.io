import { Code, Coffee, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-xl font-bold text-black dark:text-white">
            Gabriel Halus
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>and</span>
            <Code className="w-4 h-4 text-purple-500" />
            <span>and lots of</span>
            <Coffee className="w-4 h-4 text-amber-500" />
          </div>

          <p className="text-center caption max-w-md">
            Fullstack Developer | System Architech | OSS Enthusiast
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 caption text-center sm:flex-nowrap sm:justify-start">
            <span className="w-full sm:w-auto">
              &copy;
              {" "}
              {new Date().getFullYear()}
              {" "}
              Gabriel Halus. All rights
              reserved.
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span className="w-full sm:w-auto">
              Built with Next.js &amp; Tailwind CSS.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
