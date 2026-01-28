import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { FeaturedProperties } from "@/app/components/FeaturedProperties";
import { Destinations } from "@/app/components/Destinations";
import { ExclusiveEvents } from "@/app/components/ExclusiveEvents";
import { BrandStory } from "@/app/components/BrandStory";
import { Testimonials } from "@/app/components/Testimonials";
import { InspirationalCTA } from "@/app/components/InspirationalCTA";
import { Footer } from "@/app/components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-bone-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Destinations />
      <ExclusiveEvents />
      <BrandStory />
      <Testimonials />
      <InspirationalCTA />
      <Footer />
    </div>
  );
}
