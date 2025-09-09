import { motion } from 'motion/react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from './theme-context'
import { Button } from './ui/button'

interface HeaderProps {
  onLoginClick: () => void
}

export function Header({ onLoginClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center glow-box">
            <span className="text-white text-sm">N</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
            NSL
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('home')}
            className="text-foreground hover:text-sky-500 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('team')}
            className="text-foreground hover:text-sky-500 transition-colors"
          >
            Team
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="text-foreground hover:text-sky-500 transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-foreground hover:text-sky-500 transition-colors"
          >
            Contact
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={onLoginClick}
            className="hidden md:flex bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box"
          >
            Login
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-t border-border"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-foreground hover:text-sky-500 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="block w-full text-left text-foreground hover:text-sky-500 transition-colors"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-foreground hover:text-sky-500 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-foreground hover:text-sky-500 transition-colors"
            >
              Contact
            </button>
            <Button
              onClick={onLoginClick}
              className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white"
            >
              Login
            </Button>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .glow-box {
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </motion.header>
  )
}