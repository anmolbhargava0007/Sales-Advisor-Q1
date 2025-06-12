
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
  const { chatMessages = [], workspaceLoadingStates, isWorkspaceLoading, isNewChatLoading, selectedWorkspace, sendMessage } = useWorkspace();
  const { isAppValid } = useAuth();
  const [copiedMap, setCopiedMap] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

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

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [msgId]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [msgId]: false }));
    }, 2000);
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

  const isCurrentWorkspaceLoading = selectedWorkspace ? workspaceLoadingStates[selectedWorkspace.ws_id] : isNewChatLoading;

  return (
    <>
      <div className="flex flex-col h-full bg-gray-800 relative">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
              <div className="h-12 w-12 md:h-16 md:w-16 mb-4 text-gray-500 flex items-center justify-center bg-gray-700 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 md:h-10 md:w-10"
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
              <h2 className="text-xl md:text-2xl font-semibold text-center">What's on your mind today?
              </h2>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto w-full space-y-4 md:space-y-6">
              {chatMessages
                .filter((msg) => msg.content && msg.content.trim() !== "")
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative max-w-[95%] md:max-w-5xl px-3 md:px-5 pr-10 py-3 md:py-4 rounded-2xl text-sm md:text-base leading-relaxed ${msg.type === "user"
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 hover:bg-[#A259FF]/90 text-white"
                        : "bg-gray-800 text-gray-100"
                        } shadow-[0_-3px_6px_rgba(0,0,0,0.1),0_3px_6px_rgba(0,0,0,0.1),-3px_0_6px_rgba(0,0,0,0.1),3px_0_6px_rgba(0,0,0,0.1)]`}
                    >
                      <div className={`${msg.type === "bot" ? "pt-4" : ""} prose max-w-none prose-sm md:prose-base`}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto">
                                <table
                                  className="min-w-full border-separate border-spacing-y-1 rounded-lg overflow-hidden shadow-md text-xs md:text-sm"
                                  {...props}
                                />
                              </div>
                            ),
                            thead: ({ node, ...props }) => (
                              <thead className="bg-blue-700 text-white border-b border-blue-400" {...props} />
                            ),
                            th: ({ node, ...props }) => (
                              <th
                                className="px-2 md:px-4 py-1 md:py-2 text-left border-b border-blue-400 text-xs md:text-sm"
                                {...props}
                              />
                            ),
                            tbody: ({ node, ...props }) => <tbody {...props} />,
                            tr: ({ node, ...props }) => (
                              <tr className="bg-gray-800 hover:bg-gray-700 border-b border-gray-700" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                              <td
                                className="px-2 md:px-4 py-1 md:py-2 align-top border-b border-gray-700 text-xs md:text-sm"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      {msg.type === "bot" && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-600/70 rounded transition-all text-xs"
                          title="Copy response"
                        >
                          {copiedMap[msg.id] ? "Copied!" : (
                            <div className="flex items-center gap-1">
                              <ClipboardCopy className="h-3 w-3 md:h-4 md:w-4" />
                              Copy
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              {isCurrentWorkspaceLoading && (
                <div className="flex justify-start">
                  <div className="relative max-w-[85%] md:max-w-3xl px-3 md:px-5 py-3 md:py-4 rounded-2xl text-sm leading-relaxed bg-gray-700 text-gray-100 shadow-lg">
                    <DotLoader />
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-3 md:p-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-600 p-2 md:p-3 flex gap-2 md:gap-3 rounded-xl items-end min-h-[48px] shadow-lg">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask anything related to SBIL.."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isCurrentWorkspaceLoading}
                className="w-full resize-none bg-transparent text-gray-100 border-none focus:outline-none focus:ring-0 rounded-xl px-3 md:px-4 py-2 md:py-3 min-h-[40px] max-h-[120px] overflow-y-auto placeholder:text-gray-400 text-sm md:text-base"
                style={{
                  minHeight: '40px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4a5568 transparent'
                }}
              />
              <Button
                variant="default"
                onClick={handleSend}
                disabled={isCurrentWorkspaceLoading || !input.trim()}
                className="bg-gradient-to-br from-purple-500 hover:bg-[#A259FF]/90 text-white rounded-md h-9 shadow-sm flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
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
