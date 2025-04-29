import { getPageContent } from "@/lib/data-service";
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
  const content = await getPageContent("home");

  return (
    <section className="bg-white">
      <Header
        logo={content.header.logo}
        navigation={content.header.navigation}
        ctaButton={content.header.ctaButton}
      />
      <main>
        <HeroSection />
        <StatsSection stats={content.stats} />
        <PartnersSection
          title={content.partners.title}
          logos={content.partners.logos}
        />
        <FeaturesSection
          title={content.features.title}
          description={content.features.description}
          features={content.features.items}
          image={content.features.image}
          sidebar={content.features.sidebar}
        />
        <IntegrationsSection
          title={content.integrations.title}
          description={content.integrations.description}
          logos={content.integrations.logos}
        />
        <BenefitsSection benefits={content.benefits} />
        <TestimonialsSection
          title={content.testimonials.title}
          testimonials={content.testimonials.items}
        />
        <ContactSection
          title={content.contact.title}
          description={content.contact.description}
          email={content.contact.email}
          mapImage={content.contact.mapImage}
          ctaButton={content.contact.ctaButton}
        />
      </main>
      <Footer
        links={content.footer.links}
        copyright={content.footer.copyright}
      />
    </section>
  );
}
