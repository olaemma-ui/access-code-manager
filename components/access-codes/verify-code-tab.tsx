"use client";

import type React from "react";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { Loader2, TicketCheck, X } from "lucide-react";
import { StyledInput, StyledButton } from "../ui/styled";

interface VerifyCodeTabProps {
  onSuccess?: () => void;
}


export function VerifyCodeTab({ onSuccess }: VerifyCodeTabProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string | undefined>();
  const [message, setMessage] = useState<null | string | undefined>();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setErrorMessage("lease enter an access code");
      setMessage(null);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/access-codes/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || "Failed to verify code");
        setMessage(null);
        return;
      }

      if (data.staus === "valid") {
        setErrorMessage(null);
        setMessage("Verification Successfull");
      } else {
        setErrorMessage(data.message || "Failed to verify code");
        setMessage(null);
      }
      setCode("");
    } catch (error) {
      setErrorMessage("Failed to verify code");
      setMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        {message && <p className="text-green-600">{message}</p>}
        {/* Email field */}
        <div className="relative">
          <TicketCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
          <StyledInput
            type="text"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value.toUpperCase())
            }
            className="pl-12"
            placeholder="Enter Access code"
          />
        </div>
        {/* Sign in button */}
        <StyledButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Access Code"
          )}
        </StyledButton>
      </form>
      {/* <Toaster /> */}
    </>
  );
}
