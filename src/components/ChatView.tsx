
import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Source } from "@/types/api";

const ChatView = () => {
  const [message, setMessage] = useState("");
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chatMessages, isLoading, sendMessage } = useWorkspace();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const messageToSend = message;
    setMessage("");
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSources = (messageId: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedSources(newExpanded);
  };

  const renderSources = (sources: Source[], messageId: string) => {
    const isExpanded = expandedSources.has(messageId);
    
    return (
      <div className="mt-2">
        <button
          onClick={() => toggleSources(messageId)}
          className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1 mb-2"
        >
          <span>{isExpanded ? "Hide Citations" : "Show Citations"}</span>
          {isExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        
        {isExpanded && sources.length > 0 && (
          <div className="space-y-2 pl-2 border-l-2 border-gray-600">
            {sources.map((source, index) => (
              <div key={index} className="text-sm">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A259FF] hover:text-[#A259FF]/80 flex items-center gap-1"
                >
                  <span>{source.title}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <div className="text-gray-500 text-xs truncate">{source.url}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="max-w-3xl p-4 rounded-lg bg-gray-800 text-gray-200 border border-gray-700">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className="text-sm text-gray-400 ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-8 bg-gray-800 rounded-lg shadow-sm border border-gray-700 max-w-md">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Welcome to SalesAdvisor
              </h2>
              <p className="text-gray-300 mb-6">
                Start a conversation to get started.
              </p>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-[#A259FF] text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.type === 'bot' && msg.sources && msg.sources.length > 0 && 
                    renderSources(msg.sources, msg.id)
                  }
                </div>
              </div>
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <div className="flex items-end space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 min-h-[50px] max-h-32 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-[#A259FF] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white p-2 h-[50px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
