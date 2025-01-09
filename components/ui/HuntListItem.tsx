"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface HuntListItemProps {
    id: number
    title: string
    winRate: number
    imageUrl: string
    grade: number
    onDismiss?: () => void
    className?: string
}

export function HuntListItem({
                                        id,
                                        title,
                                        winRate,
                                        imageUrl,
                                        grade,
                                        onDismiss
                                    }: HuntListItemProps) {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(true)

    const handleClick = () => {
        router.push(`/organisateur/chasses/${id}`)
    }

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsVisible(false)
        setTimeout(() => {
            if (onDismiss) {
                onDismiss()
            }
        }, 300) // Delay to allow animation to complete
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <Card
                        className="w-full max-w-[400px] min-h-[150px] overflow-hidden shadow-lg flex flex-col sm:flex-row cursor-pointer transition-shadow hover:shadow-xl"
                        onClick={handleClick}
                    >
                        <div className="relative grid place-items-center w-full sm:w-[150px] min-h-[150px] sm:h-full flex-shrink-0">
                            <Image
                                src={imageUrl}
                                alt={title}
                                objectFit="cover"
                                className={"w-3/4 h-3/4"}
                                width={150}
                                height={150}
                            />
                        </div>
                        <div className="flex-grow p-4 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{winRate}% de réussite</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mt-2 -mr-2"
                                    onClick={handleDismiss}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg font-bold">{grade}/5</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClick()
                                    }}
                                >
                                    Détails
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

