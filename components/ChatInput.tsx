"use client"

import axios from "axios"
import { FC, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface ChatInputProps {
  chatPartner: any
  chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>("")

  const sendMessage = async () => {
    if (!input) return
    setIsLoading(true)

    try {
      await axios.post("/api/message/send", { text: input, chatId })
      setInput("")
      textareaRef.current?.focus()
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-2 border-t border-gray-200 px-4 py-3 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg p-3 shadow-sm ring-1 ring-inset ring-gray-300  ">
        <Input
          ref={textareaRef as any}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={180}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 placeholder:pl-2 placeholder:text-gray-400 focus:border-0 focus-visible:ring-0 active:border-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div className="absolute bottom-0 right-0 flex justify-between px-3 py-3">
          <div className="flex-shrin-0">
            <Button onClick={sendMessage} type="submit">
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
