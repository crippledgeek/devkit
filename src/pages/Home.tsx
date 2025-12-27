import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, ArrowRight } from 'lucide-react'
import { categories, searchTools } from '@/lib/tools'
import type { Tool } from '@/lib/tools'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredTools = useMemo(() => {
    let results = searchTools(searchQuery)

    if (selectedCategory !== 'All') {
      results = results.filter((tool) => tool.category === selectedCategory)
    }

    return results
  }, [searchQuery, selectedCategory])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          DevKit
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your Swiss Army Knife for Developer Utilities
        </p>
        <p className="text-muted-foreground mt-2">
          Fast, secure, and privacy-focused tools that work entirely in your browser
        </p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No tools found matching "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Features Section */}
      <div className="mt-24 mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose DevKit?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            title="Privacy First"
            description="All processing happens locally in your browser. Your data never leaves your device."
            icon="🔒"
          />
          <FeatureCard
            title="Lightning Fast"
            description="Built with modern technologies for instant conversions and zero lag."
            icon="⚡"
          />
          <FeatureCard
            title="Open Source"
            description="Fully transparent and open source. Contribute, audit, or fork the code."
            icon="💻"
          />
        </div>
      </div>
    </div>
  )
}

interface ToolCardProps {
  tool: Tool
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const Icon = tool.icon

  return (
    <Link
      to={tool.to}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
    >
      {/* Icon */}
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
        {tool.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {tool.description}
      </p>

      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
          {tool.category}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="text-center p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

export default Home
