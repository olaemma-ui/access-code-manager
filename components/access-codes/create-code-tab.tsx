"use client";

import type React from "react";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Ticket } from "lucide-react";
import { StyledInput, StyledButton } from "../ui/styled";

interface CreateCodeTabProps {
  onSuccess?: () => void;
}

export function CreateCodeTab({ onSuccess }: CreateCodeTabProps) {
  const [accessId, setAccessId] = useState("");
  const [totalCodes, setTotalCodes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Access ID",
        variant: "destructive",
      });
      return;
    }

    const codesCount = Number.parseInt(totalCodes);
    if (!totalCodes || codesCount <= 0 || codesCount > 10000) {
      toast({
        title: "Error",
        description: "Total codes must be between 1 and 10000",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/access-codes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessId: accessId.trim(),
          totalCodes: codesCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to generate codes",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message,
      });

      setAccessId("");
      setTotalCodes("");
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* AccessId */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
          <StyledInput
            type="number"
            value={accessId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAccessId(e.target.value)
            }
            className="pl-12"
            placeholder="Enter your AccessID"
          />
        </div>

        {/* AccessId */}
        <div className="relative">
          <Ticket className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
          <StyledInput
            type="number"
            value={totalCodes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTotalCodes(e.target.value)
            }
            className="pl-12"
            placeholder="Code required"
          />
        </div>

        {/* Create account button */}
        <StyledButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Codes...
            </>
          ) : (
            "Generate Access Codes"
          )}
        </StyledButton>
      </form>
    </>
  );
}
