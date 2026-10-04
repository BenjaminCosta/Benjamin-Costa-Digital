import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { AboutSection } from "@/components/sections/about-section";
import { AuditSection } from "@/components/sections/audit-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FeedbackSection } from "@/components/sections/feedback-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SelectedWorkSection } from "@/components/sections/selected-work-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <AuditSection />
        <SelectedWorkSection />
        <FeedbackSection />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
