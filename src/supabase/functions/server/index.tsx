import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

// Health check
app.get('/make-server-6a8107c8/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// User Registration
app.post('/make-server-6a8107c8/auth/register', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password, name, role = 'student' } = body

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (authError) {
      console.log(`Registration error for ${email}: ${authError.message}`)
      return c.json({ error: authError.message }, 400)
    }

    // Store additional user data in KV store
    const userData = {
      id: authData.user.id,
      email,
      name,
      role,
      created_at: new Date().toISOString(),
      enrolled_courses: [],
      quiz_results: []
    }

    await kv.set(`user:${authData.user.id}`, userData)

    return c.json({ 
      message: 'User registered successfully',
      user: {
        id: authData.user.id,
        email,
        name,
        role
      }
    })
  } catch (error) {
    console.log(`Registration error: ${error}`)
    return c.json({ error: 'Internal server error during registration' }, 500)
  }
})

// User Login (handled by Supabase client-side, but we can validate sessions here)
app.post('/make-server-6a8107c8/auth/validate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}`)
    
    return c.json({ 
      valid: true, 
      user: userData || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        role: user.user_metadata?.role || 'student'
      }
    })
  } catch (error) {
    console.log(`Token validation error: ${error}`)
    return c.json({ error: 'Internal server error during validation' }, 500)
  }
})

// Course Enrollment
app.post('/make-server-6a8107c8/courses/enroll', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { courseId } = body

    if (!courseId) {
      return c.json({ error: 'Course ID is required' }, 400)
    }

    // Get current user data
    const userData = await kv.get(`user:${user.id}`) || {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      role: user.user_metadata?.role || 'student',
      enrolled_courses: [],
      quiz_results: []
    }

    // Check if already enrolled
    if (userData.enrolled_courses?.includes(courseId)) {
      return c.json({ error: 'Already enrolled in this course' }, 400)
    }

    // Add course to enrolled courses
    userData.enrolled_courses = userData.enrolled_courses || []
    userData.enrolled_courses.push(courseId)
    userData.enrollment_date = userData.enrollment_date || {}
    userData.enrollment_date[courseId] = new Date().toISOString()

    // Update user data
    await kv.set(`user:${user.id}`, userData)

    // Track enrollment
    const enrollmentData = {
      user_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      progress: 0
    }
    await kv.set(`enrollment:${user.id}:${courseId}`, enrollmentData)

    return c.json({ 
      message: 'Successfully enrolled in course',
      courseId,
      enrollment: enrollmentData
    })
  } catch (error) {
    console.log(`Course enrollment error: ${error}`)
    return c.json({ error: 'Internal server error during enrollment' }, 500)
  }
})

// Get User Enrollments
app.get('/make-server-6a8107c8/courses/my-courses', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = await kv.get(`user:${user.id}`)
    const enrolledCourses = userData?.enrolled_courses || []
    
    // Get enrollment details for each course
    const enrollments = []
    for (const courseId of enrolledCourses) {
      const enrollmentData = await kv.get(`enrollment:${user.id}:${courseId}`)
      if (enrollmentData) {
        enrollments.push(enrollmentData)
      }
    }

    return c.json({ enrollments })
  } catch (error) {
    console.log(`Get enrollments error: ${error}`)
    return c.json({ error: 'Internal server error getting enrollments' }, 500)
  }
})

// Save Quiz Result
app.post('/make-server-6a8107c8/quiz/submit', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { courseId, quizId, answers, score, passed, timeSpent, totalQuestions } = body

    if (!courseId || !quizId || !answers || score === undefined) {
      return c.json({ error: 'Missing required quiz data' }, 400)
    }

    const quizResult = {
      user_id: user.id,
      course_id: courseId,
      quiz_id: quizId,
      answers,
      score,
      passed,
      time_spent: timeSpent,
      total_questions: totalQuestions,
      submitted_at: new Date().toISOString()
    }

    // Store quiz result
    const resultId = `quiz_result:${user.id}:${courseId}:${quizId}:${Date.now()}`
    await kv.set(resultId, quizResult)

    // Update user's quiz results
    const userData = await kv.get(`user:${user.id}`) || {}
    userData.quiz_results = userData.quiz_results || []
    userData.quiz_results.push(resultId)
    await kv.set(`user:${user.id}`, userData)

    // Update course progress if passed
    if (passed) {
      const enrollmentKey = `enrollment:${user.id}:${courseId}`
      const enrollmentData = await kv.get(enrollmentKey) || {}
      enrollmentData.quiz_completed = enrollmentData.quiz_completed || []
      if (!enrollmentData.quiz_completed.includes(quizId)) {
        enrollmentData.quiz_completed.push(quizId)
        enrollmentData.progress = Math.min(100, (enrollmentData.quiz_completed.length * 20)) // 20% per quiz
        await kv.set(enrollmentKey, enrollmentData)
      }
    }

    return c.json({ 
      message: 'Quiz result saved successfully',
      result: quizResult,
      resultId
    })
  } catch (error) {
    console.log(`Quiz submission error: ${error}`)
    return c.json({ error: 'Internal server error saving quiz result' }, 500)
  }
})

// Get Quiz Results
app.get('/make-server-6a8107c8/quiz/results/:courseId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const courseId = c.req.param('courseId')
    const resultsPrefix = `quiz_result:${user.id}:${courseId}`
    const results = await kv.getByPrefix(resultsPrefix)

    return c.json({ results })
  } catch (error) {
    console.log(`Get quiz results error: ${error}`)
    return c.json({ error: 'Internal server error getting quiz results' }, 500)
  }
})

// Newsletter Subscription
app.post('/make-server-6a8107c8/newsletter/subscribe', async (c) => {
  try {
    const body = await c.req.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email is required' }, 400)
    }

    // Check if already subscribed
    const existingSubscription = await kv.get(`newsletter:${email}`)
    if (existingSubscription) {
      return c.json({ error: 'Email already subscribed' }, 400)
    }

    const subscription = {
      email,
      subscribed_at: new Date().toISOString(),
      active: true
    }

    await kv.set(`newsletter:${email}`, subscription)

    return c.json({ 
      message: 'Successfully subscribed to newsletter',
      email
    })
  } catch (error) {
    console.log(`Newsletter subscription error: ${error}`)
    return c.json({ error: 'Internal server error during subscription' }, 500)
  }
})

// Contact Form Submission
app.post('/make-server-6a8107c8/contact/submit', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return c.json({ error: 'All fields are required' }, 400)
    }

    const contactSubmission = {
      name,
      email,
      subject,
      message,
      submitted_at: new Date().toISOString(),
      status: 'new'
    }

    const submissionId = `contact:${Date.now()}:${email}`
    await kv.set(submissionId, contactSubmission)

    return c.json({ 
      message: 'Contact form submitted successfully',
      submissionId
    })
  } catch (error) {
    console.log(`Contact form submission error: ${error}`)
    return c.json({ error: 'Internal server error during form submission' }, 500)
  }
})

// Get User Dashboard Data
app.get('/make-server-6a8107c8/dashboard', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = await kv.get(`user:${user.id}`) || {}
    const enrolledCourses = userData.enrolled_courses || []
    
    // Get detailed enrollment data
    const enrollments = []
    for (const courseId of enrolledCourses) {
      const enrollmentData = await kv.get(`enrollment:${user.id}:${courseId}`)
      if (enrollmentData) {
        enrollments.push(enrollmentData)
      }
    }

    // Get recent quiz results
    const quizResults = []
    if (userData.quiz_results) {
      for (const resultId of userData.quiz_results.slice(-5)) { // Last 5 results
        const result = await kv.get(resultId)
        if (result) {
          quizResults.push(result)
        }
      }
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: userData.name || user.user_metadata?.name || '',
        role: userData.role || user.user_metadata?.role || 'student'
      },
      enrollments,
      recentQuizResults: quizResults,
      stats: {
        totalCourses: enrollments.length,
        completedQuizzes: quizResults.filter(r => r.passed).length,
        averageScore: quizResults.length > 0 
          ? Math.round(quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length)
          : 0
      }
    })
  } catch (error) {
    console.log(`Dashboard data error: ${error}`)
    return c.json({ error: 'Internal server error getting dashboard data' }, 500)
  }
})

Deno.serve(app.fetch)