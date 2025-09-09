import { motion } from 'motion/react'
import { Clock, Users, Star, Award, BookOpen, Play, Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Progress } from './ui/progress'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface Course {
  id: string
  title: string
  instructor: string
  description: string
  duration: string
  students: number
  rating: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  price: number
  image: string
  lessons: number
  progress?: number
  enrolled?: boolean
  skills: string[]
}

const courses: Course[] = [
  {
    id: 'web-dev-fundamentals',
    title: 'Web Development Fundamentals',
    instructor: 'Teta Nancy',
    description: 'Master the basics of web development with HTML, CSS, and JavaScript. Build responsive websites from scratch and learn modern development practices.',
    duration: '8 weeks',
    students: 1247,
    rating: 4.8,
    level: 'Beginner',
    category: 'Web Development',
    price: 99,
    image: 'https://images.unsplash.com/photo-1673515335564-fbe94030e4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBsZWFybmluZyUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1NzMzNTg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    lessons: 45,
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']
  },
  {
    id: 'react-masterclass',
    title: 'React Masterclass',
    instructor: 'Teta Nancy',
    description: 'Advanced React development covering hooks, context, state management, and modern patterns. Build production-ready applications.',
    duration: '10 weeks',
    students: 892,
    rating: 4.9,
    level: 'Intermediate',
    category: 'Web Development',
    price: 149,
    image: 'https://images.unsplash.com/photo-1684488624316-774ea1824d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBjb21wdXRlciUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1NzMzNTg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    lessons: 60,
    progress: 35,
    enrolled: true,
    skills: ['React', 'Redux', 'TypeScript', 'Testing']
  },
  {
    id: 'cybersecurity-basics',
    title: 'Cybersecurity Fundamentals',
    instructor: 'Aime Loic',
    description: 'Learn essential cybersecurity concepts, threat assessment, and protection strategies. Understand network security and ethical hacking basics.',
    duration: '12 weeks',
    students: 654,
    rating: 4.7,
    level: 'Beginner',
    category: 'Cybersecurity',
    price: 179,
    image: 'https://images.unsplash.com/photo-1673515335564-fbe94030e4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBsZWFybmluZyUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1NzMzNTg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    lessons: 52,
    skills: ['Network Security', 'Risk Assessment', 'Penetration Testing', 'Incident Response']
  },
  {
    id: 'database-design',
    title: 'Database Design & Management',
    instructor: 'Nani Chris',
    description: 'Master database concepts, SQL, NoSQL, and database optimization. Learn to design efficient database schemas and manage data effectively.',
    duration: '6 weeks',
    students: 478,
    rating: 4.6,
    level: 'Intermediate',
    category: 'Database',
    price: 129,
    image: 'https://images.unsplash.com/photo-1684488624316-774ea1824d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBjb21wdXRlciUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1NzMzNTg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    lessons: 35,
    skills: ['SQL', 'MongoDB', 'Database Design', 'Performance Tuning']
  },
  {
    id: 'arduino-robotics',
    title: 'Arduino Robotics Workshop',
    instructor: 'Aime Loic',
    description: 'Hands-on robotics with Arduino. Build robots, work with sensors, motors, and learn IoT integration. Perfect for beginners to robotics.',
    duration: '8 weeks',
    students: 323,
    rating: 4.9,
    level: 'Beginner',
    category: 'Robotics',
    price: 199,
    image: 'https://images.unsplash.com/photo-1673515335564-fbe94030e4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBsZWFybmluZyUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1NzMzNTg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    lessons: 40,
    progress: 72,
    enrolled: true,
    skills: ['Arduino', 'Sensors', 'Motor Control', 'IoT']
  },
  {
    id: 'full-stack-advanced',
    title: 'Advanced Full Stack Development',
    instructor: 'Teta Nancy',
    description: 'Complete full-stack development with modern frameworks, cloud deployment, and microservices architecture. Build scalable applications.',
    duration: '14 weeks',
    students: 267,
    rating: 4.8,
    level: 'Advanced',
    category: 'Web Development',
    price: 249,
    image: 'https://images.unsplash.com/photo-1684488624316-774ea1824d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBjb21wdXRlciUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1NzMzNTg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    lessons: 78,
    skills: ['Node.js', 'React', 'Docker', 'AWS', 'Microservices']
  }
]

interface CoursesSectionProps {
  onStartQuiz: (courseId: string) => void
}

export function CoursesSection({ onStartQuiz }: CoursesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const categories = ['all', ...Array.from(new Set(courses.map(course => course.category)))]
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced']

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'Advanced': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <section id="courses" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Our
            <span className="block bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
              Featured Courses
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive courses designed by industry experts to give you practical skills 
            and real-world experience in cutting-edge technologies.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <Award className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedLevel('all')
                }}
                className="border-sky-500/20 hover:bg-sky-500/10"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Course Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm course-card h-full overflow-hidden">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {course.enrolled && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-sky-500 text-white">
                        <Play className="h-3 w-3 mr-1" />
                        Enrolled
                      </Badge>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-sky-500 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sky-500 text-sm mb-3">by {course.instructor}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {course.enrolled && course.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {course.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{course.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-sky-500">
                      ${course.price}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {course.enrolled ? (
                      <>
                        <Button className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box">
                          Continue Learning
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
                          onClick={() => onStartQuiz(course.id)}
                        >
                          Take Quiz
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box">
                          Enroll Now
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full hover:bg-sky-500/10 hover:text-sky-500"
                        >
                          View Details
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all courses.
            </p>
          </motion.div>
        )}

        {/* Course Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-gradient-to-r from-sky-400/10 to-sky-600/10 rounded-2xl p-8 border border-sky-500/20"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">
                {courses.length}+
              </div>
              <div className="text-muted-foreground">Active Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">
                {courses.reduce((acc, course) => acc + course.students, 0).toLocaleString()}+
              </div>
              <div className="text-muted-foreground">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">
                {(courses.reduce((acc, course) => acc + course.rating, 0) / courses.length).toFixed(1)}
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">
                {courses.reduce((acc, course) => acc + course.lessons, 0)}+
              </div>
              <div className="text-muted-foreground">Total Lessons</div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .course-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(14, 165, 233, 0.1);
        }
        .glow-box {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </section>
  )
}