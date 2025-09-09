import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Trophy, Target, Brain } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { useAuth } from './auth-context'
import { quiz as quizAPI } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  timeLimit: number // in minutes
  passingScore: number // percentage
}

const quizzes: Record<string, Quiz> = {
  'web-dev-fundamentals': {
    id: 'web-dev-fundamentals',
    title: 'Web Development Fundamentals Quiz',
    description: 'Test your knowledge of HTML, CSS, and JavaScript basics.',
    timeLimit: 15,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'Which HTML element is used to define the main content of a document?',
        options: ['<header>', '<main>', '<section>', '<article>'],
        correctAnswer: 1,
        explanation: 'The <main> element represents the main content of a document, excluding content that is repeated across documents.',
        category: 'HTML'
      },
      {
        id: 'q2',
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1,
        explanation: 'CSS stands for Cascading Style Sheets, which describes how HTML elements are to be displayed.',
        category: 'CSS'
      },
      {
        id: 'q3',
        question: 'Which JavaScript method is used to add an element to the end of an array?',
        options: ['append()', 'push()', 'add()', 'insert()'],
        correctAnswer: 1,
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
        category: 'JavaScript'
      },
      {
        id: 'q4',
        question: 'What is the correct way to create a flexbox container?',
        options: ['display: flex', 'flex: container', 'layout: flex', 'container: flex'],
        correctAnswer: 0,
        explanation: 'To create a flexbox container, you set the display property to flex on the parent element.',
        category: 'CSS'
      },
      {
        id: 'q5',
        question: 'Which HTML attribute is used to specify an alternate text for an image?',
        options: ['title', 'src', 'alt', 'description'],
        correctAnswer: 2,
        explanation: 'The alt attribute provides alternative text for an image if it cannot be displayed.',
        category: 'HTML'
      }
    ]
  },
  'react-masterclass': {
    id: 'react-masterclass',
    title: 'React Masterclass Quiz',
    description: 'Advanced React concepts, hooks, and best practices.',
    timeLimit: 20,
    passingScore: 75,
    questions: [
      {
        id: 'q1',
        question: 'What is the purpose of the useEffect hook?',
        options: ['To manage state', 'To handle side effects', 'To create components', 'To render JSX'],
        correctAnswer: 1,
        explanation: 'useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or DOM updates.',
        category: 'React Hooks'
      },
      {
        id: 'q2',
        question: 'Which method is used to update state in a functional component?',
        options: ['setState()', 'useState()', 'updateState()', 'changeState()'],
        correctAnswer: 1,
        explanation: 'useState() is a hook that returns a state variable and a function to update it in functional components.',
        category: 'React Hooks'
      },
      {
        id: 'q3',
        question: 'What is the virtual DOM?',
        options: ['A copy of the real DOM', 'A JavaScript representation of the DOM', 'A browser API', 'A React component'],
        correctAnswer: 1,
        explanation: 'The virtual DOM is a JavaScript representation of the actual DOM that React uses for efficient updates.',
        category: 'React Concepts'
      },
      {
        id: 'q4',
        question: 'What is the correct way to pass data from parent to child component?',
        options: ['Using state', 'Using props', 'Using context', 'Using refs'],
        correctAnswer: 1,
        explanation: 'Props are used to pass data from parent components to child components in React.',
        category: 'React Concepts'
      }
    ]
  },
  'cybersecurity-basics': {
    id: 'cybersecurity-basics',
    title: 'Cybersecurity Fundamentals Quiz',
    description: 'Test your understanding of basic cybersecurity concepts and practices.',
    timeLimit: 25,
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'What does CIA stand for in cybersecurity?',
        options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Computer Information Access', 'Cyber Intelligence Analysis'],
        correctAnswer: 1,
        explanation: 'CIA in cybersecurity refers to the three core principles: Confidentiality, Integrity, and Availability.',
        category: 'Security Principles'
      },
      {
        id: 'q2',
        question: 'What is a firewall?',
        options: ['A type of malware', 'A network security device', 'An encryption method', 'A password manager'],
        correctAnswer: 1,
        explanation: 'A firewall is a network security device that monitors and filters incoming and outgoing network traffic.',
        category: 'Network Security'
      },
      {
        id: 'q3',
        question: 'What is phishing?',
        options: ['A type of encryption', 'A social engineering attack', 'A network protocol', 'A firewall technique'],
        correctAnswer: 1,
        explanation: 'Phishing is a social engineering attack where attackers impersonate trusted entities to steal sensitive information.',
        category: 'Social Engineering'
      },
      {
        id: 'q4',
        question: 'What is the purpose of penetration testing?',
        options: ['To create malware', 'To test system vulnerabilities', 'To encrypt data', 'To monitor network traffic'],
        correctAnswer: 1,
        explanation: 'Penetration testing is used to identify and test vulnerabilities in systems and networks.',
        category: 'Testing'
      }
    ]
  }
}

interface QuizSectionProps {
  courseId: string | null
  onClose: () => void
}

export function QuizSection({ courseId, onClose }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { user } = useAuth()

  const quiz = courseId ? quizzes[courseId] : null
  const currentQuestion = quiz?.questions[currentQuestionIndex]
  const totalQuestions = quiz?.questions.length || 0
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0

  useEffect(() => {
    if (quiz && quizStarted && isTimerActive) {
      setTimeRemaining(quiz.timeLimit * 60) // Convert minutes to seconds
    }
  }, [quiz, quizStarted, isTimerActive])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false)
            handleFinishQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeRemaining])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setIsTimerActive(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStartTime(Date.now())
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleFinishQuiz = async () => {
    if (!user || !quiz || !quizStartTime) {
      setIsTimerActive(false)
      setShowResults(true)
      return
    }

    setIsTimerActive(false)
    setIsSubmitting(true)

    try {
      const results = calculateResults()
      const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000) // in seconds

      await quizAPI.submitResult(
        courseId!,
        quiz.id,
        selectedAnswers,
        results.score,
        results.passed,
        timeSpent,
        quiz.questions.length
      )

      toast.success('Quiz results saved successfully!')
    } catch (error: any) {
      console.error('Error saving quiz results:', error)
      toast.error('Failed to save quiz results')
    } finally {
      setIsSubmitting(false)
      setShowResults(true)
    }
  }

  const calculateResults = () => {
    if (!quiz) return { score: 0, passed: false, correctAnswers: 0 }
    
    const correctAnswers = quiz.questions.reduce((count, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? count + 1 : count
    }, 0)
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore
    
    return { score, passed, correctAnswers }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStarted(false)
    setIsTimerActive(false)
    setQuizStartTime(null)
  }

  if (!quiz) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Quiz Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The requested quiz could not be found.
            </p>
            <Button onClick={onClose}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <Card className="h-full">
          <CardContent className="p-8 h-full overflow-y-auto">
            {!quizStarted ? (
              // Quiz Introduction
              <div className="text-center space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Courses
                  </Button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mx-auto glow-box">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  
                  <h1 className="text-3xl font-bold">{quiz.title}</h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {quiz.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Target className="h-6 w-6 text-sky-500" />
                      </div>
                      <div className="font-bold">{totalQuestions}</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-6 w-6 text-sky-500" />
                      </div>
                      <div className="font-bold">{quiz.timeLimit} min</div>
                      <div className="text-sm text-muted-foreground">Time Limit</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Trophy className="h-6 w-6 text-sky-500" />
                      </div>
                      <div className="font-bold">{quiz.passingScore}%</div>
                      <div className="text-sm text-muted-foreground">Passing Score</div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-6 max-w-2xl mx-auto">
                    <h3 className="font-bold mb-3">Quiz Instructions:</h3>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left">
                      <li>• Read each question carefully before selecting your answer</li>
                      <li>• You can navigate between questions using the Next/Previous buttons</li>
                      <li>• Make sure to answer all questions before submitting</li>
                      <li>• The timer will start when you click "Start Quiz"</li>
                      <li>• You need {quiz.passingScore}% or higher to pass</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleStartQuiz}
                    className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box px-8 py-3 text-lg"
                  >
                    Start Quiz
                  </Button>
                </motion.div>
              </div>
            ) : showResults ? (
              // Quiz Results
              <AnimatePresence mode="wait">
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  {(() => {
                    const results = calculateResults()
                    return (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <Button variant="ghost" onClick={onClose}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Courses
                          </Button>
                        </div>

                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto glow-box ${
                          results.passed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
                        }`}>
                          {results.passed ? (
                            <Trophy className="h-10 w-10 text-white" />
                          ) : (
                            <XCircle className="h-10 w-10 text-white" />
                          )}
                        </div>

                        <h2 className="text-3xl font-bold">
                          {results.passed ? 'Congratulations!' : 'Keep Learning!'}
                        </h2>
                        
                        <p className="text-lg text-muted-foreground">
                          {results.passed 
                            ? 'You have successfully passed the quiz!'
                            : `You scored ${results.score}%. You need ${quiz.passingScore}% to pass.`
                          }
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                          <div className="bg-muted/50 rounded-xl p-6">
                            <div className="text-3xl font-bold text-sky-500 mb-2">{results.score}%</div>
                            <div className="text-sm text-muted-foreground">Final Score</div>
                          </div>
                          
                          <div className="bg-muted/50 rounded-xl p-6">
                            <div className="text-3xl font-bold text-sky-500 mb-2">{results.correctAnswers}/{totalQuestions}</div>
                            <div className="text-sm text-muted-foreground">Correct Answers</div>
                          </div>
                          
                          <div className="bg-muted/50 rounded-xl p-6">
                            <div className={`text-3xl font-bold mb-2 ${results.passed ? 'text-green-500' : 'text-red-500'}`}>
                              {results.passed ? 'PASS' : 'FAIL'}
                            </div>
                            <div className="text-sm text-muted-foreground">Result</div>
                          </div>
                        </div>

                        {/* Answer Review */}
                        <div className="max-w-3xl mx-auto">
                          <h3 className="text-xl font-bold mb-6">Review Your Answers</h3>
                          <div className="space-y-4">
                            {quiz.questions.map((question, index) => {
                              const userAnswer = selectedAnswers[question.id]
                              const isCorrect = userAnswer === question.correctAnswer
                              
                              return (
                                <div key={question.id} className="bg-muted/50 rounded-xl p-6 text-left">
                                  <div className="flex items-start space-x-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                      {isCorrect ? (
                                        <CheckCircle className="h-4 w-4 text-white" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium mb-2">
                                        Question {index + 1}: {question.question}
                                      </h4>
                                      <div className="space-y-1 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">Your answer: </span>
                                          <span className={userAnswer !== undefined ? (isCorrect ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground'}>
                                            {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                                          </span>
                                        </div>
                                        {!isCorrect && (
                                          <div>
                                            <span className="text-muted-foreground">Correct answer: </span>
                                            <span className="text-green-500">{question.options[question.correctAnswer]}</span>
                                          </div>
                                        )}
                                        <div className="text-muted-foreground italic mt-2">
                                          {question.explanation}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            onClick={restartQuiz}
                            variant="outline"
                            className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retake Quiz
                          </Button>
                          <Button
                            onClick={onClose}
                            className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white"
                          >
                            Back to Courses
                          </Button>
                        </div>
                      </>
                    )
                  })()}
                </motion.div>
              </AnimatePresence>
            ) : (
              // Quiz Questions
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={onClose}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Exit Quiz
                    </Button>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </Badge>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span className={timeRemaining < 300 ? 'text-red-500' : 'text-muted-foreground'}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  {currentQuestion && (
                    <div className="space-y-6">
                      <div className="bg-muted/50 rounded-xl p-6">
                        <div className="flex items-start space-x-3">
                          <Badge variant="outline" className="mt-1">
                            {currentQuestion.category}
                          </Badge>
                        </div>
                        <h2 className="text-xl font-bold mt-4 mb-6">
                          {currentQuestion.question}
                        </h2>
                        
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                                selectedAnswers[currentQuestion.id] === index
                                  ? 'border-sky-500 bg-sky-500/10 text-sky-500'
                                  : 'border-border bg-background hover:border-sky-500/50 hover:bg-sky-500/5'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  selectedAnswers[currentQuestion.id] === index
                                    ? 'border-sky-500 bg-sky-500'
                                    : 'border-muted-foreground'
                                }`}>
                                  {selectedAnswers[currentQuestion.id] === index && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  )}
                                </div>
                                <span className="font-medium">
                                  {String.fromCharCode(65 + index)}. {option}
                                </span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={handlePrevQuestion}
                          disabled={currentQuestionIndex === 0}
                        >
                          Previous
                        </Button>
                        
                        <div className="flex space-x-3">
                          {currentQuestionIndex === totalQuestions - 1 ? (
                            <Button
                              onClick={handleFinishQuiz}
                              className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white"
                              disabled={selectedAnswers[currentQuestion.id] === undefined}
                            >
                              Finish Quiz
                            </Button>
                          ) : (
                            <Button
                              onClick={handleNextQuestion}
                              disabled={selectedAnswers[currentQuestion.id] === undefined}
                            >
                              Next
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <style jsx>{`
        .glow-box {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </div>
  )
}