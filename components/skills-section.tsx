"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Palette, Database, Globe, Smartphone, Zap } from "lucide-react"

export default function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("skills")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  const skillCategories = [
    {
      icon: Code,
      title: "Frontend Development",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      percentage: 90,
    },
    {
      icon: Database,
      title: "Backend Development",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
      percentage: 85,
    },
    {
      icon: Globe,
      title: "Web3 & Blockchain",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      skills: ["Ethereum", "Smart Contracts", "Web3.js", "DeFi", "NFTs"],
      percentage: 75,
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200 dark:border-teal-800",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
      percentage: 80,
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      skills: ["React Native", "Flutter", "iOS", "Android", "Cross-platform"],
      percentage: 70,
    },
    {
      icon: Zap,
      title: "AI & Machine Learning",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      skills: ["Python", "TensorFlow", "OpenAI API", "Computer Vision", "NLP", "DeepSeek", "Xiaomi"],
      percentage: 65,
    },
  ]

  const tools = [
    "VS Code",
    "Git",
    "Docker",
    "AWS",
    "Vercel",
    "Figma",
    "Postman",
    "MongoDB Compass",
    "Chrome DevTools",
    "Notion",
  ]

  return (
    <section
      id="skills"
      className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-bl from-indigo-400/20 to-teal-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
          >
            My Skills
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
            TECHNICAL{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              EXPERTISE
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Specialized in modern web technologies with expertise spanning frontend, backend, and emerging technologies
            like Web3 and AI.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, index) => (
            <Card
              key={index}
              className={`border-2 ${category.borderColor} hover:shadow-xl transition-all duration-500 hover:scale-105 ${category.bgColor} backdrop-blur-sm group`}
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out",
              }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${category.bgColor} border ${category.borderColor} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proficiency</span>
                    <span className={`text-sm font-bold ${category.color}`}>{category.percentage}%</span>
                  </div>
                  <Progress
                    value={isVisible ? category.percentage : 0}
                    className="h-2"
                    style={{
                      transition: "all 1s ease-out 0.5s",
                    }}
                  />
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="text-xs px-3 py-1 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tools & Technologies */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Tools & Technologies I Use</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {tools.map((tool, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-6 py-3 text-sm font-semibold bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  animationDelay: `${index * 50}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(10px)",
                  transition: "all 0.4s ease-out",
                }}
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
