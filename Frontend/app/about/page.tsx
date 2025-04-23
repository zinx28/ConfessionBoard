import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex  flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-6 w-6" />
          <span>ConfessBoard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
        </nav>
      </header>
      <main className="flex py-12 px-4">
        <div className="flex mx-auto flex-col gap-8">
          <div className="flex  flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold">About ConfessBoard</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A safe space for sharing thoughts and feelings anonymously.
            </p>
          </div>

          <div className="space-y-6 max-w-3xl items-center justify-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2 ">Our Mission</h2>
              <p>
                ConfessBoard was created to provide a platform where people can
                express themselves freely without fear of judgment. We believe
                that sometimes the things we most want to say are the hardest to
                share face-to-face.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Connect with your Discord account to create your personal
                  confession board
                </li>
                <li>
                  Share your unique board link with friends or on social media
                </li>
                <li>
                  Others can visit your board and leave anonymous confessions
                </li>
                <li>
                  You receive and read the confessions, but never know who sent
                  them
                </li>
              </ol>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4">Ready to create your own confession board?</p>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">
          © 2025 ConfessBoard. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
