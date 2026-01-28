import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { HostingHero } from "@/app/components/Hosting/HostingHero";
import { HostingPricing } from "@/app/components/Hosting/HostingPricing";
import { HostingBenefits } from "@/app/components/Hosting/HostingBenefits";
import { HostingCTA } from "@/app/components/Hosting/HostingCTA";
import { HostingTestimonials } from "@/app/components/Hosting/HostingTestimonials";

export function HostingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gradient-to-br dark:from-[#0f1219] dark:via-charcoal-blue dark:to-[#0f1219]">
      <Navbar initialBackground={false} />
      <HostingHero />
      <HostingPricing />
      <HostingBenefits />
      <HostingCTA />
      <HostingTestimonials />
      <Footer />
    </div>
  );
}
