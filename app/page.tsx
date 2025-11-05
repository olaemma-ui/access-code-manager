"use client";

import type React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AuthCard } from "@/components/auth/auth-card";
import Image from "next/image";

export default function AuthPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4-"
      style={{
        backgroundImage: "url('/image.jpeg')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AuthCard />
      <Toaster />
    </div>
  );
}
