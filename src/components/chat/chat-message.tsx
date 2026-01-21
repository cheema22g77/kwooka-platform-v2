"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Helper functions
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function getRiskLevelColor(level: string): string {
  const colors: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return colors[level] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
}
import { Bot, User, AlertTriangle, ExternalLink, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 px-4 py-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 border-2 border-kwooka-500/30 shadow-lg shadow-kwooka-500/10 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-kwooka-500 to-ochre-600 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            "relative px-5 py-4 text-[15px] leading-relaxed",
            isUser
              ? "chat-bubble-user"
              : "chat-bubble-ai"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-li:my-1 max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold text-kwooka-500 mt-4 mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold text-kwooka-400 mt-3 mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-kwooka-400">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1">{children}</ol>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm text-kwooka-300">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-slate-900 p-3 rounded-lg text-sm overflow-x-auto">
                        {children}
                      </code>
                    );
                  },
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-kwooka-400 hover:text-kwooka-300 underline inline-flex items-center gap-1"
                    >
                      {children}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Metadata for AI messages */}
        {!isUser && message.metadata && (
          <div className="flex flex-wrap gap-2 mt-1">
            {/* Risk Level Badge */}
            {message.metadata.riskLevel && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  getRiskLevelColor(message.metadata.riskLevel)
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                {message.metadata.riskLevel.charAt(0).toUpperCase() + 
                  message.metadata.riskLevel.slice(1)} Risk
              </span>
            )}

            {/* Confidence Score */}
            {message.metadata.confidence && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {Math.round(message.metadata.confidence * 100)}% confidence
              </span>
            )}

            {/* Regulation References */}
            {message.metadata.regulationRefs?.map((ref, index) => (
              <a
                key={index}
                href={ref.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
              >
                <BookOpen className="h-3 w-3" />
                {ref.section}
              </a>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <Avatar className="h-10 w-10 border-2 border-slate-700 shadow-lg flex-shrink-0">
          <AvatarFallback className="bg-slate-800 text-slate-300">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}

// Typing indicator component
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 px-4 py-6"
    >
      <Avatar className="h-10 w-10 border-2 border-kwooka-500/30 shadow-lg shadow-kwooka-500/10 flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-kwooka-500 to-ochre-600 text-white">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>

      <div className="chat-bubble-ai">
        <div className="typing-indicator">
          <span />
          <span />
          <span />
        </div>
      </div>
    </motion.div>
  );
}
