"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, Zap, Shield, Brain, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export default function Component() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    // Add the new animation styles to the document
    const style = document.createElement("style")
    style.textContent = `
    @keyframes border-flow {
      0% { background-position: 0% 0; }
      100% { background-position: 100% 0; }
    }
    @keyframes border-flow-reverse {
      0% { background-position: 100% 0; }
      100% { background-position: 0% 0; }
    }
    .animate-border-flow {
      animation: border-flow 3s infinite linear;
    }
    .animate-border-flow-reverse {
      animation: border-flow-reverse 3s infinite linear;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-cyan-500/20">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              PDFWhisper
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-300 hover:text-cyan-400 transition-colors">
              About
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300">
            <Sparkles className="w-3 h-3 mr-1" />
            Now in Beta
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
              Talk to Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              PDF Documents
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your PDF workflow with AI-powered conversations. Upload multiple documents and chat with them like
            never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="relative bg-black border-0 text-cyan-400 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden"
            >
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span
                  className="absolute inset-0 rounded-xl animate-border-flow"
                  style={{
                    background: "linear-gradient(90deg, #00FFFF, #FF00FF, #00FFFF)",
                    backgroundSize: "300% 100%",
                    border: "2px solid transparent",
                    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
              </span>
              <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse text-cyan-400" />
              Try Beta
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="relative bg-black/30 border-0 text-purple-400 px-8 py-4 rounded-xl transition-all duration-300 group overflow-hidden"
            >
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span
                  className="absolute inset-0 rounded-xl animate-border-flow-reverse"
                  style={{
                    background: "linear-gradient(90deg, #FF00FF, #00FFFF, #FF00FF)",
                    backgroundSize: "300% 100%",
                    border: "2px solid transparent",
                    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
              </span>
              Watch Demo
            </Button>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Natural Conversations</h3>
                <p className="text-gray-400 text-sm">
                  Ask questions in plain English and get instant answers from your documents.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Multiple PDFs</h3>
                <p className="text-gray-400 text-sm">
                  Upload and chat with multiple documents simultaneously for comprehensive insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-pink-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                  <Brain className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">AI-Powered</h3>
                <p className="text-gray-400 text-sm">
                  Advanced AI understands context and provides accurate, relevant responses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to revolutionize how you interact with your documents
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Smart Conversations",
                description: "Engage in natural dialogue with your PDFs using advanced AI technology.",
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: FileText,
                title: "Multi-Document Support",
                description: "Work with multiple PDFs simultaneously for comprehensive research.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get instant responses with our optimized AI processing engine.",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your documents are processed securely with enterprise-grade encryption.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Brain,
                title: "Context Aware",
                description: "AI understands document context for more accurate and relevant answers.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Sparkles,
                title: "Smart Summaries",
                description: "Generate intelligent summaries and extract key insights automatically.",
                color: "from-pink-500 to-rose-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-2xl p-12 border border-cyan-500/20 backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Transform Your PDF Experience?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already revolutionizing how they work with documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="relative bg-black border-0 text-cyan-400 font-semibold px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden"
              >
                <span className="absolute inset-0 overflow-hidden rounded-xl">
                  <span
                    className="absolute inset-0 rounded-xl animate-border-flow"
                    style={{
                      background: "linear-gradient(90deg, #00FFFF, #FF00FF, #00FFFF)",
                      backgroundSize: "300% 100%",
                      border: "2px solid transparent",
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                </span>
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse text-cyan-400" />
                Try Beta Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="relative bg-black/30 border-0 text-purple-400 px-12 py-4 rounded-xl transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute inset-0 overflow-hidden rounded-xl">
                  <span
                    className="absolute inset-0 rounded-xl animate-border-flow-reverse"
                    style={{
                      background: "linear-gradient(90deg, #FF00FF, #00FFFF, #FF00FF)",
                      backgroundSize: "300% 100%",
                      border: "2px solid transparent",
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                </span>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
        <footer className="relative z-10 px-6 py-6 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; 2024 PDFWhisper. All rights reserved.</p>
        </footer>

    </div>
  )
}
