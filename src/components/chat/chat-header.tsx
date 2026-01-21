"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectorSelector } from "./sector-selector";
import { ComplianceSector } from "@/types";
import type { SectorId } from "@/config/sectors";
import { 
  MessageSquarePlus, 
  History, 
  Settings,
  Bot,
  Sparkles
} from "lucide-react";

interface ChatHeaderProps {
  sector: ComplianceSector | null;
  onSectorChange: (sector: ComplianceSector | null) => void;
  onNewChat: () => void;
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
}

export function ChatHeader({ 
  sector, 
  onSectorChange, 
  onNewChat,
  onOpenHistory,
  onOpenSettings
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Logo glow effect */}
            <div className="absolute inset-0 bg-kwooka-500/30 rounded-xl blur-lg" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-kwooka-500 to-ochre-600 shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
          </motion.div>
          
          <div>
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              Compliance Copilot
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-kwooka-500/20 text-kwooka-400 border border-kwooka-500/30">
                <Sparkles className="h-2.5 w-2.5" />
                AI
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Kwooka Health Services
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Sector Selector */}
          <SectorSelector
            value={sector}
            onChange={onSectorChange}
            className="w-48 hidden sm:flex"
          />

          {/* New Chat */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="text-slate-400 hover:text-kwooka-400"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>

          {/* History */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHistory}
            className="text-slate-400 hover:text-kwooka-400"
          >
            <History className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="text-slate-400 hover:text-kwooka-400"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile sector selector */}
      <div className="px-4 pb-3 sm:hidden">
        <SectorSelector
          value={sector}
          onChange={onSectorChange}
          className="w-full"
        />
      </div>
    </header>
  );
}
