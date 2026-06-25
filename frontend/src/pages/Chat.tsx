import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import StatsBar from '../components/sections/StatsBar';
import ChatSection from '../components/sections/ChatSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';

export default function Chat() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <ChatSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
