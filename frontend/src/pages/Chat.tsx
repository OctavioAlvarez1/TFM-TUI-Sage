import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import StatsBar from '../components/sections/StatsBar';
import ChatSection from '../components/sections/ChatSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import { useSageStream } from '../hooks/useSageStream';

export default function Chat() {
  const { messages, isLoading, sendMessage } = useSageStream();

  const handleSearch = (q: string) => {
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    sendMessage(q);
  };

  return (
    <>
      <Header />
      <main>
        <HeroSection onSearch={handleSearch} />
        <StatsBar />
        <ChatSection messages={messages} isLoading={isLoading} sendMessage={sendMessage} />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
