import SolarSystemBanner from '@/components/store/home/SolarSystemBanner'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <SolarSystemBanner />

      {/* Main Content Area - Placeholder for future sections */}
      <div className="container mx-auto px-4 py-24 md:px-6 max-w-7xl">
        <section className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="font-heading text-heading-xl text-stardust-white mb-6">
            The Era of Cosmic Dressing
          </h2>
          <p className="font-body text-eclipse-silver leading-relaxed text-lg">
            Vastrayug is built on the belief that clothing is not neutral.
            The colours touching your skin, the symbols near your heart, and the
            intention behind your garments carry frequency. They shape how you feel,
            how you move, and how the world responds to you.
          </p>
        </section>

        {/* Featured Collections Placeholder */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-heading text-heading-lg text-stardust-white border-b-2 border-nebula-gold pb-2 inline-block">
              Planetary Alignment
            </h2>
            <a href="/collections" className="font-body text-sm text-nebula-gold hover:text-stardust-white transition-colors uppercase tracking-wider">
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mock Collection Cards */}
            {[
              { title: 'Surya Collection', planet: 'Sun', energy: 'Leadership & Vitality', color: 'from-[#D4A017]/20 to-transparent' },
              { title: 'Chandra Collection', planet: 'Moon', energy: 'Intuition & Emotion', color: 'from-[#B8D4E3]/20 to-transparent' },
              { title: 'Shani Collection', planet: 'Saturn', energy: 'Discipline & Depth', color: 'from-[#191970]/20 to-transparent' },
            ].map((collection) => (
              <div key={collection.title} className="group relative aspect-[3/4] overflow-hidden bg-deep-indigo border border-white/5 hover:border-nebula-gold/30 transition-colors duration-500 cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color}`} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-body tracking-widest text-nebula-gold uppercase mb-2 block">
                    {collection.planet}
                  </span>
                  <h3 className="font-heading text-2xl text-stardust-white mb-2">
                    {collection.title}
                  </h3>
                  <p className="font-body text-sm text-eclipse-silver opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {collection.energy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Story Snippet */}
        <section className="bg-deep-indigo/50 border border-white/5 p-12 text-center my-24 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-nebula-gold" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-nebula-gold" />
          <span className="text-4xl text-nebula-gold mb-6 block">✦</span>
          <p className="font-accent text-2xl text-stardust-white max-w-4xl mx-auto leading-relaxed italic">
            &quot;You are not lost. You are between chapters. Dress like the protagonist.&quot;
          </p>
        </section>
      </div>
    </div>
  )
}
