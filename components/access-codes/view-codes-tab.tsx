"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AccessCode {
  id: string
  code: string
  status: "used" | "unused"
  created_at: string
  used_at: string | null
  access_ids: {
    name: string
    access_id: string
  }
}

interface Stats {
  total: number
  used: number
  available: number
}

export function ViewCodesTab() {
  const [codes, setCodes] = useState<AccessCode[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, used: 0, available: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCodes = async (search?: string) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      const response = await fetch(`/api/access-codes/list?${params}`)
      const data = await response.json()

      if (response.ok) {
        setCodes(data.codes)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch codes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCodes()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCodes(searchTerm)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
          <div className="text-black/70 text-sm font-medium mb-1">Total Codes</div>
          <div className="text-3xl font-bold text-black">{stats.total}</div>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
          <div className="text-black/70 text-sm font-medium mb-1">Used</div>
          <div className="text-3xl font-bold text-red-300">{stats.used}</div>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
          <div className="text-black/70 text-sm font-medium mb-1">Available</div>
          <div className="text-3xl font-bold text-green-300">{stats.available}</div>
        </Card>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="space-y-2">
        <Label htmlFor="search-codes" className="text-black/90">
          Search Codes
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-black/50" />
            <Input
              id="search-codes"
              type="text"
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-black placeholder:text-black/50 focus:border-white/40 backdrop-blur-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 bg-white/20 hover:bg-white/30 text-black border border-white/20 backdrop-blur-sm rounded-md transition-all duration-200"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </div>
      </form>

      {/* Codes table */}
      {isLoading && codes.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-black/50" />
        </div>
      ) : codes.length === 0 ? (
        <div className="text-center py-8 text-black/50">No codes found</div>
      ) : (
        <ScrollArea className="rounded-md border border-white/20 bg-white/5">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-black/70">Code</TableHead>
                <TableHead className="text-black/70">Name</TableHead>
                <TableHead className="text-black/70">Status</TableHead>
                <TableHead className="text-black/70">Created</TableHead>
                <TableHead className="text-black/70">Used At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-black">{code.code}</TableCell>
                  <TableCell className="text-black/70">{code.access_ids?.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        code.status === "used"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : "bg-green-500/20 text-green-300 border-green-500/30"
                      }
                    >
                      {code.status === "used" ? "Used" : "Available"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-black/70 text-sm">{formatDate(code.created_at)}</TableCell>
                  <TableCell className="text-black/70 text-sm">
                    {code.used_at ? formatDate(code.used_at) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  )
}
