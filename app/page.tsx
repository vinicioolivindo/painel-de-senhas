"use client"

import { useState } from "react"
import PasswordDisplay from "./atendente/page"

export default function Home() {
  const [view, setView] = useState<"display" | "control">("display")
  const [currentPassword, setCurrentPassword] = useState(1)


  return (
    <main className="w-full h-screen bg-background">
        <PasswordDisplay/>
    </main>
  )
}
