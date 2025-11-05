"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CreateCodeTab } from "@/components/access-codes/create-code-tab"
import { VerifyCodeTab } from "@/components/access-codes/verify-code-tab"
import { ViewCodesTab } from "@/components/access-codes/view-codes-tab"
import { Toaster } from "@/components/ui/toaster"

export default function AccessCodesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccessfulGeneration = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card className="w-full max-w-2xl bg-white/10 border-white/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Access Code Manager</h1>
          <p className="text-black/70">Create, verify, and manage access codes</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-black text-black/70"
            >
              Create
            </TabsTrigger>
            <TabsTrigger
              value="verify"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-black text-black/70"
            >
              Verify
            </TabsTrigger>
            <TabsTrigger
              value="view"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-black text-black/70"
            >
              View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-6">
            <CreateCodeTab onSuccess={handleSuccessfulGeneration} />
          </TabsContent>

          <TabsContent value="verify" className="space-y-4 mt-6">
            <VerifyCodeTab onSuccess={handleSuccessfulGeneration} />
          </TabsContent>

          <TabsContent value="view" className="space-y-4 mt-6">
            <ViewCodesTab key={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </Card>

      <Toaster />
    </div>
  )
}
