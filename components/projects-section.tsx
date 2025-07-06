"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Star, GitFork, Eye } from "lucide-react"
import Link from "next/link"

export default function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

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

    const section = document.getElementById("projects")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "Full-featured e-commerce platform with advanced cart functionality, payment integration, and admin dashboard. Built with modern React patterns and optimized for performance.",
      image: "/images/project-coming-soon.jpeg",
      tags: ["React", "Next.js", "MongoDB", "Stripe", "Tailwind CSS"],
      category: "web",
      liveUrl: "#",
      githubUrl: "#",
      stats: { stars: 124, forks: 45, views: "2.1k" },
      featured: true,
    },
    {
      title: "DeFi Trading Dashboard",
      description:
        "Real-time cryptocurrency trading dashboard with portfolio tracking, market analysis, and automated trading strategies. Integrated with multiple DEX protocols.",
      image: "/images/project-coming-soon.jpeg",
      tags: ["React", "Web3.js", "Ethereum", "Chart.js", "TypeScript"],
      category: "web3",
      liveUrl: "#",
      githubUrl: "#",
      stats: { stars: 89, forks: 23, views: "1.8k" },
      featured: true,
    },
    {
      title: "AI Content Generator",
      description:
        "Intelligent content generation tool powered by OpenAI API. Features include blog writing, social media posts, and SEO optimization with real-time preview.",
      image: "/images/project-coming-soon.jpeg",
      tags: ["Next.js", "OpenAI API", "TypeScript", "Prisma", "PostgreSQL"],
      category: "ai",
      liveUrl: "#",
      githubUrl: "#",
      stats: { stars: 156, forks: 67, views: "3.2k" },
      featured: false,
    },
    {
      title: "Task Management App",
      description:
        "Collaborative project management tool with real-time updates, team collaboration features, and advanced analytics. Perfect for remote teams.",
      image: "/images/project-coming-soon.jpeg",
      tags: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
      category: "web",
      liveUrl: "#",
      githubUrl: "#",
      stats: { stars: 78, forks: 34, views: "1.5k" },
      featured: false,
    },
    {
      title: "NFT Marketplace",
      description:
        "Decentralized NFT marketplace with minting capabilities, auction system, and royalty distribution. Built on Ethereum with IPFS storage.",
      image: "/images/project-coming-soon.jpeg",
      tags: ["React", "Solidity", "IPFS", "Web3.js", "Hardhat"],
      category: "web3",
      liveUrl: "#",
      githubUrl: "#",
      stats: { stars: 203, forks: 89, views: "4.1k" },
      featured: true,
    },
    {
      title: "Weather Analytics Dashboard",
      description:
        "Advanced weather monitoring system with predictive analytics, historical data visualization, and location-based alerts using machine learning.",
      image: "/images/project-coming-soon.jpeg",
      tags: ["Vue.js", "Python", "TensorFlow", "D3.js", "FastAPI"],
      category: "ai",
      liveUrl: "#",
      githubUrl: "#",
      stats: { stars: 92, forks: 41, views: "2.3k" },
      featured: false,
    },
  ]

  const filters = [
    { id: "all", label: "All Projects", count: projects.length },
    { id: "web", label: "Web Apps", count: projects.filter((p) => p.category === "web").length },
    { id: "web3", label: "Web3 & Blockchain", count: projects.filter((p) => p.category === "web3").length },
    { id: "ai", label: "AI & ML", count: projects.filter((p) => p.category === "ai").length },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  return (
    <section
      id="projects"
      className="py-24 bg-gradient-to-br from-white via-gray-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-gradient-to-bl from-red-400/20 to-orange-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-60 h-60 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 text-sm font-semibold bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          >
            My Projects
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
            FEATURED{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">WORK</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A showcase of my recent projects spanning web development, blockchain applications, and AI-powered
            solutions.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg scale-105"
                  : "border-2 border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:scale-105"
              }`}
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={index}
              className={`group overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
                project.featured ? "ring-2 ring-orange-200 dark:ring-orange-800" : ""
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease-out",
              }}
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              {/* Project Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/90 hover:bg-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Project Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {project.stats.stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {project.stats.forks}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {project.stats.views}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0 flex gap-3">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href={project.liveUrl}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 font-semibold transition-all duration-300 bg-transparent"
                >
                  <Link href={project.githubUrl}>
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 bg-transparent"
          >
            View All Projects on GitHub
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
