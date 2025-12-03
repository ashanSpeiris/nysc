'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Sparkles,
  User,
  Bot,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function PhoenixChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Phoenix AI, your virtual assistant for the National Youth Services Council. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // TODO: Replace with actual API call to Phoenix AI
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Thank you for your message! Phoenix AI is currently being integrated. Once connected, I will be able to answer your questions about volunteering, registration process, and more.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'How do I register as a volunteer?',
    'What are the volunteer types available?',
    'What should I bring to the camp?',
    'How can I change my registration?',
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-secondary text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/50"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-6 w-6">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                AI
              </span>
            </span>
            <Sparkles className="absolute -top-2 -left-2 h-4 w-4 text-accent animate-pulse" />
          </button>
          <p className="mt-2 text-xs text-center text-muted-foreground max-w-[80px]">
            Phoenix AI
          </p>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={`fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl border-2 border-primary/20 transition-all duration-300 ${
            isMinimized
              ? 'h-14 w-80'
              : 'h-[600px] w-96 max-h-[calc(100vh-3rem)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary to-secondary p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold text-white flex items-center gap-1">
                  Phoenix AI
                  <Sparkles className="h-3 w-3" />
                </h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <div
                        className={`flex h-full w-full items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-primary'
                            : 'bg-gradient-to-br from-secondary to-accent'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </Avatar>
                    <div
                      className={`flex flex-col gap-1 max-w-[80%] ${
                        message.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground px-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-accent">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </Avatar>
                    <div className="rounded-2xl border bg-white px-4 py-2 shadow-sm">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="border-t bg-white p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Suggested questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-accent/10 hover:border-accent transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t bg-white p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Powered by Phoenix AI
                </p>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
