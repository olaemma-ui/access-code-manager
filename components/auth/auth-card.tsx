"use client";

import type React from "react";
import { useState } from "react";
import { StyledButton, StyledInput } from "@/components/ui/styled";
import { X, TicketCheck } from "lucide-react";
import { CreateCodeTab } from "../access-codes/create-code-tab";
import { VerifyCodeTab } from "../access-codes/verify-code-tab";
import Image from "next/image";

export function AuthCard() {
  const [activeTab, setActiveTab] = useState("verify");

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccessfulGeneration = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-4xl p-8 pt-0 px-0">
        <Image
          src={"/image-1.jpeg"}
          className="w-full h-[250px] rounded-t-4xl pb-8"
          width={300}
          height={50}
          alt="Image"
        />
        {/* Header with tabs and close button */}
        <div className="flex items-center justify-between mb-8 px-8">
          <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("verify")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === "verify"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Verify Code
            </button>
            <button
              onClick={() => setActiveTab("generate")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === "generate"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Generate Code
            </button>
          </div>
          <button className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full md:flex hidden items-center justify-center border border-white/10 hover:bg-black/40 transition-all duration-200 hover:scale-110 hover:rotate-90">
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        <h1 className="text-3xl font-normal px-8 text-white mb-8 transition-all duration-300">
          {activeTab === "generate" ? "Generate Code" : "Verify Code"}
        </h1>

        <div className="relative overflow-hidden px-8">
          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "generate"
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            {/* Generatde Access Code Form */}
            <CreateCodeTab onSuccess={handleSuccessfulGeneration} />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "verify"
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            <VerifyCodeTab onSuccess={handleSuccessfulGeneration} />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-white/40 text-sm font-medium">
            {"You're Welcome"}
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="text-center border-white/10">
          <p className="text-white/80 text-xs">
            Celebration of LIFE, LEGACY & GRACE
          </p>
        </div>
      </div>
    </div>
  );
}
