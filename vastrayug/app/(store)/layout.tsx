import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import StorefrontProviders from '@/components/store/layout/StorefrontProviders';
import AnnouncementBar from '@/components/store/layout/AnnouncementBar';
import Navbar from '@/components/store/layout/Navbar';
import Footer from '@/components/store/layout/Footer';
import PopupManager from '@/components/store/layout/PopupManager';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch session server-side to pass it to the client provider
  const session = await getServerSession(authOptions);

  return (
    <StorefrontProviders session={session}>
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <PopupManager />
      </div>
    </StorefrontProviders>
  );
}
