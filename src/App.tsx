import { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-context'
import { AuthProvider } from './components/auth-context'
import { Header } from './components/header'
import { HeroSection } from './components/hero-section'
import { CoursesSection } from './components/courses-section'
import { TeamSection } from './components/team-section'
import { ServicesSection } from './components/services-section'
import { ContactSection } from './components/contact-section'
import { Footer } from './components/footer'
import { LoginModal } from './components/login-modal'
import { QuizSection } from './components/quiz-section'
import { UserDashboard } from './components/user-dashboard'
import { Loading } from './components/loading'
import { Toaster } from './components/ui/sonner'

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Listen for dashboard open events
    const handleOpenDashboard = () => setIsDashboardOpen(true)
    window.addEventListener('openDashboard', handleOpenDashboard)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('openDashboard', handleOpenDashboard)
    }
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onLoginClick={() => setIsLoginOpen(true)} />
      
      <main>
        <HeroSection />
        <CoursesSection onStartQuiz={setActiveQuiz} />
        <TeamSection />
        <ServicesSection />
        <ContactSection />
      </main>
      
      <Footer />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

      {activeQuiz && (
        <QuizSection
          courseId={activeQuiz}
          onClose={() => setActiveQuiz(null)}
        />
      )}

      {isDashboardOpen && (
        <UserDashboard
          onClose={() => setIsDashboardOpen(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}