
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-slate-800">Your App</h1>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Ready to build something amazing
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Your Empty
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Application
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              A beautiful, clean slate ready for your next big idea. Start building something incredible with modern tools and elegant design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-5 h-5 mr-2" />
                Start Building
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Clean & Modern</h3>
              <p className="text-slate-600">Built with the latest technologies and best practices for a smooth development experience.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Fully Responsive</h3>
              <p className="text-slate-600">Designed to work perfectly on all devices, from mobile phones to desktop computers.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Scale</h3>
              <p className="text-slate-600">Built with scalability in mind, ready to grow with your project and requirements.</p>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to start your journey?</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              This empty application is your canvas. Add features, customize the design, and make it uniquely yours.
            </p>
            <Button size="lg" className="bg-slate-800 hover:bg-slate-900">
              Begin Building
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-slate-500">
            <p>&copy; 2024 Your App. Ready for your next big idea.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
