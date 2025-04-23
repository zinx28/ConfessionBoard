import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-6 w-6" />
          <span>ConfessBoard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Share Your Thoughts Anonymously
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Create your own confession board and let others share their secrets with you.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button className="gap-1">
                    Connect with Discord
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Create Your Board</h3>
                <p className="text-center text-gray-500">
                  Connect with Discord and create your own confession board in seconds.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Share Your Link</h3>
                <p className="text-center text-gray-500">
                  Share your unique board link with friends or on social media.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Receive Confessions</h3>
                <p className="text-center text-gray-500">
                  Get anonymous confessions from people who want to share their thoughts with you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2025 ConfessBoard. All rights reserved.</p>
      </footer>
    </div>
  )
}
