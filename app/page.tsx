import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LayoutDashboard, 
  Sparkles, 
  Zap, 
  Rocket, 
  Code2,
  ArrowRight,
  Check
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Powered by React 19
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Builder POC
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            A production-ready showcase of <strong>React 19</strong> and
            featuring real-time updates and modern web capabilities.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboards">
              <Button size="lg" className="gap-2">
                <LayoutDashboard className="h-5 w-5" />
                View Dashboards
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/react19-features">
              <Button size="lg" variant="outline" className="gap-2">
                <Code2 className="h-5 w-5" />
                React 19 Features
              </Button>
            </Link>
            
            <Link href="/nextjs15-features">
              <Button size="lg" variant="outline" className="gap-2">
                <Rocket className="h-5 w-5" />
                Next.js 15 Features
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">React 19 Features Implemented</h2>
          <p className="text-gray-600">All the latest capabilities in one place</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Server Components</CardTitle>
              <CardDescription>
                Fast data fetching with zero client JavaScript
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Direct database access
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Better SEO
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Server Actions</CardTitle>
              <CardDescription>
                CRUD operations without API routes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Built-in CSRF protection
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Type-safe mutations
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>useOptimistic</CardTitle>
              <CardDescription>
                Instant UI updates with auto-rollback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Zero perceived latency
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Automatic error recovery
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>useActionState</CardTitle>
              <CardDescription>
                Smart form state management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Built-in loading states
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Auto error handling
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-pink-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>useTransition</CardTitle>
              <CardDescription>
                Non-blocking UI updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Responsive interactions
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Visual feedback
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>useDeferredValue</CardTitle>
              <CardDescription>
                Smooth input with heavy operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Buttery smooth typing
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                Large dataset handling
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next.js 15 Features Section */}
      <div className="container mx-auto px-4 py-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Next.js 15 Features</h2>
          <p className="text-gray-600">Enhanced performance, security, and developer experience</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Turbopack</CardTitle>
              <CardDescription>10x faster dev builds</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔄 Async APIs</CardTitle>
              <CardDescription>cookies(), headers(), params</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Better Caching</CardTitle>
              <CardDescription>Fine-grained staleTimes</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/nextjs15-features">
            <Button size="lg" className="gap-2">
              <Rocket className="h-5 w-5" />
              Explore Next.js 15 Features
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Explore?</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Experience React 19 + Next.js 15 with interactive demos and real examples
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboards">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                <LayoutDashboard className="h-5 w-5" />
                Try the Builder
              </Button>
            </Link>
            <Link href="/react19-features">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Sparkles className="h-5 w-5" />
                React 19 Demo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}