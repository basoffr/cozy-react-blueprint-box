
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <Hero />
      <DashboardPreview />
      <Footer />
    </div>
  );
};

export default Index;
