import { motion } from 'motion/react'
import { Github, Linkedin, Mail, Shield, Code, Database } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

const teamMembers = [
  {
    name: "Aime Loic",
    role: "Backend Developer & Cybersecurity Engineer",
    description: "Specializes in secure backend architectures and cybersecurity implementations. Expert in protecting digital infrastructure and building robust server-side solutions.",
    skills: ["Node.js", "Python", "Cybersecurity", "Cloud Security", "API Development"],
    icon: Shield,
    gradient: "from-red-400 to-red-600",
    glowColor: "rgba(239, 68, 68, 0.3)"
  },
  {
    name: "Teta Nancy",
    role: "Full Stack Developer",
    description: "Bridges frontend and backend technologies to create seamless user experiences. Passionate about creating scalable web applications and modern development practices.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    icon: Code,
    gradient: "from-sky-400 to-sky-600",
    glowColor: "rgba(14, 165, 233, 0.3)"
  },
  {
    name: "Nani Chris",
    role: "Frontend Developer & Database Specialist",
    description: "Creates intuitive user interfaces and manages complex database systems. Combines UI/UX expertise with strong database architecture knowledge.",
    skills: ["React", "Vue.js", "PostgreSQL", "UI/UX", "Database Design"],
    icon: Database,
    gradient: "from-green-400 to-green-600",
    glowColor: "rgba(34, 197, 94, 0.3)"
  }
]

export function TeamSection() {
  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Meet Our
            <span className="block bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
              Expert Team
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our diverse team of technology experts brings together years of experience 
            in development, cybersecurity, and education to deliver exceptional learning experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm team-card">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${member.gradient} text-white mb-4 member-glow`}
                      style={{
                        boxShadow: `0 0 20px ${member.glowColor}`
                      }}
                    >
                      <member.icon className="h-8 w-8" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className={`bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent font-medium`}>
                      {member.role}
                    </p>
                  </div>

                  <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-center">Core Skills</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm hover:bg-sky-500/10 hover:text-sky-500 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 pt-4">
                      <Button variant="ghost" size="icon" className="hover:text-sky-500">
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-sky-500">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-sky-500">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-sky-400/10 to-sky-600/10 rounded-2xl p-8 border border-sky-500/20">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join hundreds of students who have transformed their careers with our expert guidance.
            </p>
            <Button className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box">
              Start Learning Today
            </Button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .team-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1);
        }
        .member-glow {
          transition: box-shadow 0.3s ease;
        }
        .glow-box {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </section>
  )
}