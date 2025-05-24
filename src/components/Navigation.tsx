
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">DashPro</h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-white hover:text-purple-300 transition-colors px-3 py-2 text-sm font-medium">
                Features
              </a>
              <a href="#" className="text-white hover:text-purple-300 transition-colors px-3 py-2 text-sm font-medium">
                Pricing
              </a>
              <a href="#" className="text-white hover:text-purple-300 transition-colors px-3 py-2 text-sm font-medium">
                About
              </a>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-purple-300 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="text-white hover:text-purple-300 block px-3 py-2 text-base font-medium">
              Features
            </a>
            <a href="#" className="text-white hover:text-purple-300 block px-3 py-2 text-base font-medium">
              Pricing
            </a>
            <a href="#" className="text-white hover:text-purple-300 block px-3 py-2 text-base font-medium">
              About
            </a>
            <button className="w-full text-left bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 text-base font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
