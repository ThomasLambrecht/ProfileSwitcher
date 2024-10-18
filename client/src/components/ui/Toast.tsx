import React, { useEffect, useState } from "react"
import { X } from "lucide-react"

type ToastProps = {
  id: number
  title: string
  description: string
  variant?: "default" | "destructive"
  onDismiss: (id: number) => void
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onDismiss(id), 300) // Wait for fade-out animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onDismiss])

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"} ${variant === "destructive" ? "bg-red-600 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm">{description}</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="ml-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
