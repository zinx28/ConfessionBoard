"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare } from "lucide-react"

export default function BoardPage({ params }: { params: { username: string } }) {
  const [confession, setConfession] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would handle the submission to your backend
    setTimeout(() => {
      setConfession("")
      setIsSubmitting(false)
      // Show success message
    }, 1000)
  }

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
      <main className="flex-1 container max-w-3xl py-8 px-4">
        <Link href="/" className="flex items-center gap-1 text-sm mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{params.username}'s Confession Board</CardTitle>
            <CardDescription>
              Share your thoughts anonymously with {params.username}. They won't know who you are.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your confession here..."
                  value={confession}
                  onChange={(e) => setConfession(e.target.value)}
                  className="min-h-[150px]"
                  required
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Confession"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            All confessions are anonymous. The board owner will not be able to see who sent this message.
          </CardFooter>
        </Card>

        <div className="text-center">
          <p className="mb-4">Want your own confession board?</p>
          <Link href="/login">
            <Button variant="outline">Create Your Board</Button>
          </Link>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2025 ConfessBoard. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
