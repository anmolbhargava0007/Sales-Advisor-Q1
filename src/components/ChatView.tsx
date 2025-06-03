
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import FreeTierModal from "@/components/FreeTierModal";
import { Loader } from "@/components/ui/loader";

const ChatView = () => {
  const [input, setInput] = useState("");
  const [showFreeTierModal, setShowFreeTierModal] = useState(false);
  const { chatMessages = [], isLoading, isWorkspaceLoading, sendMessage } = useWorkspace();
  const { isAppValid } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatMessages]);

  const checkFreeTier = () => {
    if (!isAppValid) {
      setShowFreeTierModal(true);
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!checkFreeTier()) return;

    const messageToSend = input.trim();
    setInput("");
    try {
      await sendMessage(messageToSend);
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const DotLoader = () => (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-2 h-2 bg-gray-300 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );

  // Show workspace loading spinner
  if (isWorkspaceLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full bg-gray-800">
        {/* Chat messages */}
        <div className="flex-grow overflow-y-auto px-4 py-6 space-y-6">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="h-16 w-16 mb-4 text-gray-500 flex items-center justify-center bg-gray-700 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h.01M15 12h.01M12 18h.01M12 6h.01M7.5 12a4.5 4.5 0 019 0"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Start a conversation</h2>
            </div>
          ) : (
            <>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`relative max-w-4xl px-5 py-4 rounded-2xl text-sm leading-relaxed ${msg.type === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                      : "bg-gray-800 text-gray-100"
                      } shadow-[0_-3px_6px_rgba(0,0,0,0.1),0_3px_6px_rgba(0,0,0,0.1),-3px_0_6px_rgba(0,0,0,0.1),3px_0_6px_rgba(0,0,0,0.1)]`}
                  >
                    <div className="prose max-w-none text-gray-100">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ node, ...props }) => (
                            <table
                              className="min-w-full border-separate border-spacing-y-2 rounded-lg overflow-hidden shadow-md"
                              {...props}
                            />
                          ),
                          thead: ({ node, ...props }) => (
                            <thead className="bg-blue-700 text-white border-b border-blue-400" {...props} />
                          ),
                          th: ({ node, ...props }) => (
                            <th className="px-4 py-2 text-left border-b border-blue-400" {...props} />
                          ),
                          tbody: ({ node, ...props }) => <tbody {...props} />,
                          tr: ({ node, ...props }) => (
                            <tr className="bg-gray-800 hover:bg-gray-700 border-b border-gray-700" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-4 py-2 align-top border-b border-gray-700" {...props} />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>

                    </div>
                    {msg.type === "bot" && (
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        title="Copy response"
                        type="button"
                      >
                        <ClipboardCopy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="relative max-w-3xl px-5 py-4 rounded-2xl text-sm leading-relaxed bg-gray-800 text-gray-100
                               shadow-[0_-3px_6px_rgba(0,0,0,0.1),0_3px_6px_rgba(0,0,0,0.1),-3px_0_6px_rgba(0,0,0,0.1),3px_0_6px_rgba(0,0,0,0.1)]"
                  >
                    <DotLoader />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-gray-600 mb-5 p-2 w-[80%] mx-auto flex gap-2 rounded-xl items-center min-h-[48px]">
          <textarea
            rows={1}
            placeholder="Ask anything related to SBIL.."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full resize-none bg-transparent text-gray-100 border-none focus:outline-none focus:ring-0 rounded-xl px-4 py-3 min-h-[40px] max-h-48 overflow-y-auto scroll-thin scrollbar-thumb-gray-700 scrollbar-track-transparent placeholder:text-gray-400"
          />
          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow-md text-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <FreeTierModal
        isOpen={showFreeTierModal}
        onClose={() => setShowFreeTierModal(false)}
      />
    </>
  );
};

export default ChatView;