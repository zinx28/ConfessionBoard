// holy cow!

"use client"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Chevron } from "react-day-picker";
import { ChevronRight } from "lucide-react";
import { BoardSettings } from "@/types/board";

export function  CreateBoardDialog({
    open,
    onOpenChange,
    onCreate
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void
    onCreate: (settings: BoardSettings) => Promise<void>
}) {
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
        onOpenChange(false)
        setCurrentStep(1)
    }

    const handleCreate = async () => {
        await onCreate(boardSettings)
        handleDialogClose();
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                <Chevron className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                        )}

                        {currentStep < totalSteps ? (
                            <Button onClick={nextStep} disabled={!canProceed()}>
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleCreate} disabled={!canProceed()}>
                                Create Board
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>)
}