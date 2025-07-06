"use client"

import { Award, Users, Coffee, Code } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutSection() {
  const achievements = [
    { icon: Award, label: "Years Experience", value: "3+", color: "text-orange-500" },
    { icon: Users, label: "Happy Clients", value: "50+", color: "text-purple-500" },
    { icon: Coffee, label: "Projects Done", value: "100+", color: "text-indigo-500" },
    { icon: Code, label: "Code Commits", value: "1000+", color: "text-teal-500" },
  ]

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "Web3",
    "Blockchain",
    "AI/ML",
    "UI/UX Design",
    "Manga Artist",
    "Paint Expert",
    "Industrial Plastics Expert",
  ]

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 text-sm font-semibold bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300"
          >
            About Me
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-8">
            MY{" "}
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">STORY</span>
          </h2>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64">
              <div className="image-frame bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-900/20 dark:to-purple-900/20 p-2">
                <img
                  src="/images/profile-real.jpeg"
                  alt="Aldi Zakia Pratama"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl rotate-12 shadow-lg" />
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl -rotate-12 shadow-lg" />
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Passionate developer with a journey that started in 6th grade, now specializing in modern web technologies
              and emerging tech.
            </p>
          </div>

          {/* Story Text */}
          <div className="space-y-6 mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Hi, I'm <span className="font-semibold text-orange-500">Aldi Zakia Pratama</span>, a dedicated student at
              <span className="font-semibold"> SMK WISUDA KARYA</span>. My coding journey began when I was just in 6th
              grade, and since then, I've been passionate about creating digital solutions that make a difference.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Over the years, I've developed expertise in modern web technologies, with a special focus on
              <span className="font-semibold text-purple-500"> React, Next.js, and Web3 development</span>. I love
              building applications that are not only functional but also provide exceptional user experiences.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and sharing
              my knowledge with the developer community. I believe in using technology to solve real-world problems.
            </p>
          </div>

          {/* Skills Tags */}
          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Technologies I Work With</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 hover:from-orange-100 hover:to-purple-100 dark:hover:from-orange-900/20 dark:hover:to-purple-900/20 transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <achievement.icon className={`w-8 h-8 mx-auto mb-3 ${achievement.color}`} />
                  <div className={`text-2xl font-bold mb-1 ${achievement.color}`}>{achievement.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{achievement.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
