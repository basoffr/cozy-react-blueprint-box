
import { ArrowRight, BarChart3, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-white text-sm font-medium">Now in Beta</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Beautiful
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Dashboard </span>
            Analytics
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your data into actionable insights with our modern dashboard platform. 
            Beautiful visualizations, real-time updates, and powerful analytics at your fingertips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
            >
              View Dashboard
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg hover:bg-white/20 transition-all duration-300">
              View Demo
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-center">
            <div className="flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400 mr-2" />
              <span className="text-white font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center justify-center">
              <Users className="w-6 h-6 text-pink-400 mr-2" />
              <span className="text-white font-medium">Team Collaboration</span>
            </div>
            <div className="flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-white font-medium">Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
