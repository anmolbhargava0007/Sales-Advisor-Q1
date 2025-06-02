
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ChatView = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: string, content: string, type: 'user' | 'bot', timestamp: number}>>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      type: 'user' as const,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
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
          messages.map((msg) => (
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
              </div>
            </div>
          ))
        )}
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
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
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
