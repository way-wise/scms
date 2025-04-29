import HeroSection from "@/components/sections/hero-section";
import StatsSection from "@/components/sections/stats-section";
import PartnersSection from "@/components/sections/partners-section";
import FeaturesSection from "@/components/sections/features-section";
import IntegrationsSection from "@/components/sections/integrations-section";
import BenefitsSection from "@/components/sections/benefits-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import ContactSection from "@/components/sections/contact-section";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default async function HomePage() {
  // Fetch all content for the homepage

  return (
    <section className="bg-white">
      <Header />
      <main>
        <HeroSection />
      </main>
      {/* <Footer
        links={content.footer.links}
        copyright={content.footer.copyright}
      /> */}
    </section>
  );
}
