"use client"

import * as React from "react"
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils" // 确保你有这个工具函数，如果没有可以直接用 classNames 替代

interface Message {
  id: string
  role: "agent" | "user"
  content: string
}

export function AiAgentChat() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "您好！我是您的智能采购助手。正在为您连接全球买家数据库...\n\n请告诉我您主要经营的产品品类，我将为您匹配合适的采购商。",
    },
  ])

  const scrollRef = React.useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // 模拟 AI 思考和回复 (这里后续可以对接真实的 API)
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: `收到！正在为您搜索 "${userMsg.content}" 相关的采购商资源...\n\n我们发现英国和北美市场对该品类需求旺盛。建议您留下联系方式，我们的专家团队会在 24 小时内发送详细的买家列表给您。`,
      }
      setMessages((prev) => [...prev, agentMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* 聊天窗口 */}
      <div
        className={cn(
          "w-[350px] md:w-[380px] flex flex-col bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right overflow-hidden",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-10 pointer-events-none h-0"
        )}
      >
        {/* 顶部标题栏 */}
        <div className="relative p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border border-white/20 shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0A] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1">
                寻找采购商 <Sparkles size={12} className="text-yellow-400" />
              </h3>
              <p className="text-[10px] text-gray-300">AI 智能匹配 | 24h 在线</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 消息内容区 */}
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#050505]"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              {/* 头像 */}
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5">
                {msg.role === "agent" ? (
                  <Bot size={16} className="text-blue-400" />
                ) : (
                  <User size={16} className="text-gray-400" />
                )}
              </div>

              {/* 气泡 */}
              <div
                className={cn(
                  "p-3 text-sm rounded-2xl max-w-[80%] leading-relaxed whitespace-pre-wrap animate-[fade-in-up_0.3s]",
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-[#1A1A1A] text-gray-200 border border-white/10 rounded-tl-none"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* 输入中动画 */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5">
                <Bot size={16} className="text-blue-400" />
              </div>
              <div className="bg-[#1A1A1A] p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* 底部输入区 */}
        <div className="p-3 border-t border-white/10 bg-[#0A0A0A]">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的产品关键词..."
              className="w-full bg-[#1A1A1A] text-white text-sm rounded-full pl-4 pr-12 py-3 border border-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* 悬浮开关按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95",
          isOpen
            ? "bg-[#1A1A1A] text-white rotate-90"
            : "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
        )}
      >
        {/* 呼吸光环 */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></span>
        )}
        
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageSquare size={24} className="fill-current" />
        )}
      </button>
    </div>
  )
}