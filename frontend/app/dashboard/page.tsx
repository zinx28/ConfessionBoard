"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, ChevronLeft, ChevronRight, Copy, MessageSquare, Shield, Users } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface BoardSettings {
  title: string
  description: string
  allowMultiple: boolean
  requireModeration: boolean
  allowAnonymous: boolean
  maxLength: string
  cooldownPeriod: string
  theme: string,
  isPublic: boolean
  customSlug: string
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useUserStore();
  const router = useRouter();
  // these stuff are temp, these are only added to get the base feature working, then the
  // improvements and the actual stuff will be implemented
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boardSettings, setBoardSettings] = useState<BoardSettings>({
    title: "",
    description: "",
    allowMultiple: false,
    requireModeration: false,
    allowAnonymous: true,
    maxLength: "500",
    cooldownPeriod: "none",
    theme: "dark",
    isPublic: true,
    customSlug: "",
  })


  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <div className="flex min-h-screen items-center justify-center">
    <Spinner className="h-8 w-8" />
  </div>;

  // this should be removed on view api called
  const [boards, setBoards] = useState([
    {
      id: "board1",
      title: "ThisIsAExample",
      description: "This is a public board!",
      message_count: 0,
    }
  ]);


  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) {
      return boardSettings.title.trim().length > 0
    }
    return true
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDialogClose = () => {
    setShowCreateBoard(false)
    setCurrentStep(1)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="font-medium">Start with the feeling!!</p>
                <p className="mt-1 text-sm text-muted-foreground">Make the confession interesting! <i>shhh</i></p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Board Title *</Label>
                <Input
                  id="title"
                  placeholder="My Confession Board"
                  value={boardSettings.title}
                  onChange={(e) => setBoardSettings((prev) => ({ ...prev, title: e.target.value }))}
                />
                <p className="text-xs text-gray-500">This will be displayed at the top of your board</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Share your thoughts with me anonymously..."
                  value={boardSettings.description}
                  onChange={(e) => setBoardSettings((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  Help people understand what kind of confessions you're looking for
                </p>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="font-medium">Privacy & Security</p>
                <p className="mt-1 text-sm text-muted-foreground">Configure who can access your board and how</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Public Board</Label>
                  <p className="text-sm text-gray-500">Allow anyone to find your board through search</p>
                </div>
                <input
                  type="checkbox"
                  disabled
                  checked={boardSettings.isPublic}
                  onChange={(e) => setBoardSettings((prev) => ({ ...prev, isPublic: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Anonymous Confessions</Label>
                  <p className="text-sm text-gray-500">Let people submit without knowing who they are</p>
                </div>
                <input
                  type="checkbox"
                  checked={boardSettings.allowAnonymous}
                  onChange={(e) => setBoardSettings((prev) => ({ ...prev, allowAnonymous: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="font-medium">Board Settings</p>
                <p className="mt-1 text-sm text-muted-foreground">Control how people can submit confessions</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Multiple Confessions</Label>
                  <p className="text-sm text-gray-500">Let users submit more than one confession</p>
                </div>
                <input
                  type="checkbox"
                  checked={boardSettings.allowMultiple}
                  onChange={(e) => setBoardSettings((prev) => ({ ...prev, allowMultiple: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Board Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose how others see the confession</p>
                </div>
                <Select
                  value={boardSettings.theme}
                  onValueChange={(e) => setBoardSettings((prev) => ({ ...prev, theme: e }))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="dark"></SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="dark">dark</SelectItem>
                    <SelectItem value="light">light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  };

  useEffect(() => {
    async function GetBoards() {
      var baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${baseUrl}/api/v1/board/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const apiresponse = await response.json();

      if (apiresponse) {
        setBoards(apiresponse)
      }

      console.log(apiresponse);
    }

    GetBoards();
  }, []);

  const CreateBoard = async () => {
    var baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const apiResponse = await fetch(`${baseUrl}/api/v1/board/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: boardSettings.title,
        description: boardSettings.description,
        theme: boardSettings.theme,
        allowAnonymous: boardSettings.allowAnonymous,
        allowMultiple: boardSettings.allowMultiple
      }),
      credentials: "include",
    });

    const JsonParsed = await apiResponse.json();

    if (JsonParsed) {
      console.log(JsonParsed);
      if (!JsonParsed.error) {
        setShowCreateBoard(false);
        setBoards(prevBoards => [
          ...prevBoards,
          {
            id: JsonParsed.id,
            title: boardSettings.title,
            description: boardSettings.description,
            message_count: 0
          }
        ]);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-6 w-6" />
          <span>ConfessBoard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Settings
          </Link>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://cdn.discordapp.com/avatars/${user.DiscordID}/${user.Avatar}.webp`}
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </header>
      <main className="flex-1 py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              Manage your confession board and view confessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border">
              <h3 className="text-gray-400 text-sm font-medium">
                Total Boards
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {boards.length}
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-gray-400 text-sm font-medium">
                Total Confessions
              </h3>
              <p className="text-3xl font-bold text-white mt-2">-1</p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-gray-400 text-sm font-medium">
                Anonymous Boards
              </h3>
              <p className="text-3xl font-bold text-white mt-2">-1</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Boards</h1>
            <Button
              className="px-4 py-2 "
              onClick={() => setShowCreateBoard(true)}
            >
              Add New Board
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {boards.map((board) => (
              <Card className="hover:shadow-lg transition" key={board.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">  <MessageSquare className="h-5 w-5 text-primary" /> {board.title}</CardTitle>
                  <CardDescription>{board.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{board.message_count} messages</span>
                    <span>Active</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-center gap-4">
                    <Link href={`/dashboard/view/${board.id}`} key={board.id} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Confessions
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>

                    <Button size="icon" variant="ghost">
                      <Copy />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">
          © 2026 ConfessBoard. All rights reserved.
        </p>
      </footer>



      <Dialog open={showCreateBoard} onOpenChange={setShowCreateBoard}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>Create a board</DialogTitle>
            <DialogDescription>
              Step {currentStep} of {totalSteps} - Set up your confession board
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Basic Info</span>
              <span>Privacy</span>
              <span>Settings</span>
            </div>
          </div>

          <div className="min-h-[400px]">{renderStepContent()}</div>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button variant="ghost" onClick={handleDialogClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={CreateBoard} disabled={!canProceed()}>
                  Create Board
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
