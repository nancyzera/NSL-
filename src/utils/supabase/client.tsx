import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

// API endpoints
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6a8107c8`

// Auth utilities
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },

  getUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }
}

// Course utilities
export const courses = {
  enroll: async (courseId: string) => {
    try {
      const session = await auth.getSession()
      if (!session?.access_token) {
        throw new Error('Must be logged in to enroll')
      }

      const response = await fetch(`${SERVER_URL}/courses/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ courseId })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Enrollment failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Enrollment error:', error)
      throw error
    }
  },

  getMyCourses: async () => {
    try {
      const session = await auth.getSession()
      if (!session?.access_token) {
        return { enrollments: [] }
      }

      const response = await fetch(`${SERVER_URL}/courses/my-courses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get courses')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Get my courses error:', error)
      return { enrollments: [] }
    }
  }
}

// Quiz utilities
export const quiz = {
  submitResult: async (courseId: string, quizId: string, answers: Record<string, number>, score: number, passed: boolean, timeSpent: number, totalQuestions: number) => {
    try {
      const session = await auth.getSession()
      if (!session?.access_token) {
        throw new Error('Must be logged in to submit quiz')
      }

      const response = await fetch(`${SERVER_URL}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          courseId, 
          quizId, 
          answers, 
          score, 
          passed, 
          timeSpent, 
          totalQuestions 
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit quiz')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Quiz submission error:', error)
      throw error
    }
  },

  getResults: async (courseId: string) => {
    try {
      const session = await auth.getSession()
      if (!session?.access_token) {
        return { results: [] }
      }

      const response = await fetch(`${SERVER_URL}/quiz/results/${courseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get quiz results')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Get quiz results error:', error)
      return { results: [] }
    }
  }
}

// Newsletter utilities
export const newsletter = {
  subscribe: async (email: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Subscription failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      throw error
    }
  }
}

// Contact utilities
export const contact = {
  submit: async (name: string, email: string, subject: string, message: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ name, email, subject, message })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Contact form submission failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Contact form error:', error)
      throw error
    }
  }
}

// Dashboard utilities
export const dashboard = {
  getData: async () => {
    try {
      const session = await auth.getSession()
      if (!session?.access_token) {
        throw new Error('Must be logged in to get dashboard data')
      }

      const response = await fetch(`${SERVER_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get dashboard data')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Dashboard data error:', error)
      throw error
    }
  }
}