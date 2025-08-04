"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/hooks/useUserStore";
import { useRouter } from "next/navigation";

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, login } = useUserStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(true);

  const CheckLogin = async () => {
    var apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log(apiUrl);
    const response = await fetch(`${apiUrl}/api/v1/account/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
    });
    var responsebc = await response.json();

    if (responsebc && !responsebc.error) {
      console.log("yo");

      login(responsebc);
      setIsSubmitting(false);
    } else if (responsebc) {
      setIsSubmitting(false);
    }
    console.log(responsebc);
  };
  const { id } = use(params);
  const [Board, setBoard] = useState({
    id: "",
    ownerId: "",
    title: "",
    description: "",
    anonymous: true,
    allowMultiple: false,
    theme: "dark",
    background: ""
  });

  const ViewBoard = async () => {
    var apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/api/v1/board/user/view/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
    });
    var responsebc = await response.json();

    if (responsebc && responsebc.error) {
      // this is temp, most likely a message iont he future
      router.push("/");
    } else if (responsebc) {
      setBoard(responsebc.data);
    }
    console.log(responsebc.data);
  };

  useEffect(() => {
    ///api/v1/board/user/view/
    ViewBoard().finally(() => {
      CheckLogin();
    });
  }, []);
  const [confession, setConfession] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    var apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/board/user/message/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        message: confession,
      }),
      credentials: "include",
    });
    var responsebc = await response.json();

    if (responsebc) {
      console.log(responsebc);
      
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-6 w-6" />
          <span>ConfessBoard</span>
        </Link>

      </header>
      <main className="flex-1  mx-auto py-8 px-4">
        <Link href="/" className="flex items-center gap-1 text-sm mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="mb-8 items-center justify-center  max-w-3xl">
          <CardHeader>
            <CardTitle>{Board.title}</CardTitle>
            <CardDescription>
              Share your thoughts anonymously with {id}. They won't know who you
              are.
            </CardDescription>
            <CardDescription>{Board.description}</CardDescription>
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Confession"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            All confessions are anonymous. The board owner will not be able to
            see who sent this message.
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
        <p className="text-xs text-gray-500">
          © 2025 ConfessBoard. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>

      <Dialog open={!isAuthenticated}>
        <DialogContent className="sm:max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Login to comment</DialogTitle>
            <DialogDescription>
              Note, if you dont have a account~ you will have limit access
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() =>
                router.push(
                  `https://discord.com/oauth2/authorize?client_id=1363320877998932209&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcheck%2Flogin&scope=identify&state=board_id=${id}`
                )
              }
            >
              Connect with discord
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
