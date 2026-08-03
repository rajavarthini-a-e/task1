import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CourseCatalog from '@/components/CourseCatalog';
import EnrollmentForm from '@/components/EnrollmentForm';
import VoiceAgentDemo from '@/components/VoiceAgentDemo';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <Hero />
      <CourseCatalog />
      <EnrollmentForm />
      <VoiceAgentDemo />
      <ContactSection />
      <Footer />
    </main>
  );
}
