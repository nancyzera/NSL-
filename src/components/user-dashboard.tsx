import { motion } from 'motion/react'
import { User, BookOpen, Trophy, Target, Calendar, Clock, TrendingUp, Award } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useAuth } from './auth-context'
import { dashboard } from '../utils/supabase/client'

interface DashboardData {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  enrollments: Array<{
    course_id: string
    enrolled_at: string
    progress: number
    quiz_completed?: string[]
  }>
  recentQuizResults: Array<{
    course_id: string
    quiz_id: string
    score: number
    passed: boolean
    submitted_at: string
  }>
  stats: {
    totalCourses: number
    completedQuizzes: number
    averageScore: number
  }
}

interface UserDashboardProps {
  onClose: () => void
}

export function UserDashboard({ onClose }: UserDashboardProps) {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await dashboard.getData()
      setDashboardData(data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCourseTitle = (courseId: string) => {
    const courseMap: Record<string, string> = {
      'web-dev': 'Web Development Fundamentals',
      'robotics': 'Robotics & Automation',
      'cybersecurity': 'Cybersecurity Essentials',
      'database': 'Database Management',
      'mobile-dev': 'Mobile App Development',
      'cloud': 'Cloud Computing'
    }
    return courseMap[courseId] || courseId
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full"
        />
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm">
      <div className="min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {dashboardData.user.name}! Track your learning progress.
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close Dashboard
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-sky-200 dark:border-sky-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-sky-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {dashboardData.stats.totalCourses}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active enrollments
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
                <Trophy className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dashboardData.stats.completedQuizzes}
                </div>
                <p className="text-xs text-muted-foreground">
                  Passed assessments
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dashboardData.stats.averageScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Quiz performance
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-sky-500" />
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {dashboardData.enrollments.length > 0 ? (
                  dashboardData.enrollments.map((enrollment) => (
                    <div key={enrollment.course_id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">
                          {getCourseTitle(enrollment.course_id)}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {enrollment.progress}%
                        </Badge>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Enrolled: {formatDate(enrollment.enrolled_at)}</span>
                        <span>
                          {enrollment.quiz_completed?.length || 0} quizzes completed
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No course enrollments yet</p>
                    <p className="text-sm">Enroll in a course to see your progress here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Quiz Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  Recent Quiz Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recentQuizResults.length > 0 ? (
                  dashboardData.recentQuizResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {getCourseTitle(result.course_id)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(result.submitted_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {result.score}%
                        </div>
                        <Badge variant={result.passed ? 'default' : 'destructive'} className="text-xs">
                          {result.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No quiz results yet</p>
                    <p className="text-sm">Take a quiz to see your results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Profile Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-sky-500" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-lg">{dashboardData.user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg">{dashboardData.user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="text-lg capitalize">{dashboardData.user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {dashboardData.enrollments.length > 0 
                        ? formatDate(dashboardData.enrollments[0].enrolled_at)
                        : 'Recently joined'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}