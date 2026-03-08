import Link from "next/link";

// Using the same list as the homepage mock
const PLANETARY_COLLECTIONS = [
  {
    name: "Surya",
    title: "The Surya Collection",
    planet: "Sun",
    energy: "Leadership & Vitality",
    color: "from-[#D4A017]/30",
    slug: "surya-collection",
  },
  {
    name: "Chandra",
    title: "The Chandra Collection",
    planet: "Moon",
    energy: "Intuition & Emotion",
    color: "from-[#B8D4E3]/30",
    slug: "chandra-collection",
  },
  {
    name: "Mangal",
    title: "The Mangal Collection",
    planet: "Mars",
    energy: "Power & Passion",
    color: "from-[#8B0000]/30",
    slug: "mangal-collection",
  },
  {
    name: "Budh",
    title: "The Budh Collection",
    planet: "Mercury",
    energy: "Intelligence & Agility",
    color: "from-[#50C878]/30",
    slug: "budh-collection",
  },
  {
    name: "Guru",
    title: "The Guru Collection",
    planet: "Jupiter",
    energy: "Wisdom & Abundance",
    color: "from-[#FADA5E]/30",
    slug: "guru-collection",
  },
  {
    name: "Shukra",
    title: "The Shukra Collection",
    planet: "Venus",
    energy: "Love & Beauty",
    color: "from-[#FFB6C1]/30",
    slug: "shukra-collection",
  },
  {
    name: "Shani",
    title: "The Shani Collection",
    planet: "Saturn",
    energy: "Discipline & Depth",
    color: "from-[#191970]/30",
    slug: "shani-collection",
  },
  {
    name: "Rahu",
    title: "The Rahu Collection",
    planet: "Rahu",
    energy: "Transformation & Mystery",
    color: "from-[#9400D3]/30",
    slug: "rahu-collection",
  },
  {
    name: "Ketu",
    title: "The Ketu Collection",
    planet: "Ketu",
    energy: "Liberation & Spirituality",
    color: "from-[#800000]/30",
    slug: "ketu-collection",
  },
];

const VIBE_COLLECTIONS = [
  {
    title: "The Sovereign",
    energy: "Power, authority, unbreakable confidence",
    slug: "the-sovereign",
  },
  {
    title: "The Healer",
    energy: "Softness, safety, grounding energy",
    slug: "the-healer",
  },
  {
    title: "The Wanderer",
    energy: "Freedom, openness, fluid exploration",
    slug: "the-wanderer",
  },
  {
    title: "The Shadow",
    energy: "Depth, introspection, embracing darkness",
    slug: "the-shadow",
  },
  {
    title: "The Reborn",
    energy: "Fresh start, hope, new chapter energy",
    slug: "the-reborn",
  },
];

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
      {/* Header */}
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <h1 className="font-heading text-display-sm md:text-display-md text-stardust-white mb-6">
          Cosmic Collections
        </h1>
        <p className="font-body text-eclipse-silver text-lg leading-relaxed">
          Every Vastrayug product is built on the concept of frequency
          alignment. Whether you connect deeply with your ruling Navagraha
          planet or an emotional vibe, find the pieces that channel your inner
          universe.
        </p>
      </div>

      {/* Planetary Architecture */}
      <section className="mb-32">
        <div className="flex flex-col items-center mb-12">
          <span className="text-nebula-gold text-2xl mb-4">✦</span>
          <h2 className="font-heading text-heading-xl text-stardust-white tracking-wide uppercase">
            The Navagraha Architecture
          </h2>
          <p className="font-body text-eclipse-silver mt-4 max-w-2xl text-center">
            Nine collections, each carrying the distinct frequency, color
            palette, and intention of its ruling celestial body.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLANETARY_COLLECTIONS.map((col) => (
            <Link
              href={`/collections/${col.slug}`}
              key={col.name}
              className="group relative aspect-[4/5] overflow-hidden bg-void-black border border-white/5 hover:border-nebula-gold/40 transition-colors duration-500"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t ${col.color} to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end text-center z-10">
                <span className="text-xs font-body tracking-[0.3em] text-nebula-gold uppercase mb-3 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {col.planet}
                </span>
                <h3 className="font-heading text-3xl text-stardust-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {col.title}
                </h3>
                <p className="font-body text-sm text-eclipse-silver opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                  {col.energy}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Vibe & Energy Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-32" />

      {/* Vibe & Energy Collections */}
      <section className="mb-20">
        <div className="flex flex-col items-center mb-16">
          <span className="text-nebula-gold text-2xl mb-4">✦</span>
          <h2 className="font-heading text-heading-xl text-stardust-white tracking-wide uppercase">
            Vibe & Energy Profiles
          </h2>
          <p className="font-body text-eclipse-silver mt-4 max-w-2xl text-center">
            For individuals who connect more to an emotional state or desired
            frequency. Dress the chapter you are entering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VIBE_COLLECTIONS.map((vibe) => (
            <Link
              href={`/collections/${vibe.slug}`}
              key={vibe.title}
              className="group relative h-64 overflow-hidden bg-deep-indigo border border-white/5 hover:border-nebula-gold/40 transition-colors duration-500 flex items-center justify-center p-8 text-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                <h3 className="font-heading text-3xl text-stardust-white mb-4 group-hover:text-nebula-gold transition-colors duration-300">
                  {vibe.title}
                </h3>
                <p className="font-body text-eclipse-silver uppercase tracking-widest text-xs">
                  {vibe.energy}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
