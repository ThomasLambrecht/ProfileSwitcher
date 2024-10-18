import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/ThemeProvider"
import { Menu, Home, Users, Settings, HelpCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const API_BASE_URL = "http://localhost:3001/api"

export function Layout() {
  const [currentProfile, setCurrentProfile] = useState("admin")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId")
    if (sessionId) {
      setIsLoggedIn(true)
      axios.defaults.headers.common["x-session-id"] = sessionId
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleProfileChange = (value: string) => {
    setCurrentProfile(value)
    navigate(`/${value}`)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId")
      await axios.post(`${API_BASE_URL}/logout`, { sessionId })
      localStorage.removeItem("sessionId")
      delete axios.defaults.headers.common["x-session-id"]
      setIsLoggedIn(false)
      navigate("/login")
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Profile Switcher App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={currentProfile} onValueChange={handleProfileChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="app">App</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex-grow flex">
        {/* Sidebar */}
        <aside className={`bg-secondary text-secondary-foreground w-64 p-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <nav className="space-y-2">
            <a href="/admin" className="flex items-center space-x-2 p-2 rounded hover:bg-primary/10">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a href="/admin/users" className="flex items-center space-x-2 p-2 rounded hover:bg-primary/10">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </a>
            <a href="/admin/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-primary/10">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-grow p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>&copy; 2023 Profile Switcher App. All rights reserved.</p>
          <nav className="flex space-x-4">
            <a href="/about" className="hover:underline">
              About
            </a>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
