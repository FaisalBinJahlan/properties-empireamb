import { notFound } from "next/navigation";
import { getPropertyById, getProperties } from "@/lib/properties";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, MapPin, Calendar, Layers, Bed, Bath, Expand, MessageCircle, Key, Share2, Save, Heart, Scale } from "lucide-react";

import PropertyGallery from "@/components/ui/PropertyGallery";
import PropertyFeatures from "@/components/ui/PropertyFeatures";
import Button from "@/components/ui/Button";
import SimilarProperties from "@/components/sections/SimilarProperties";

interface PropertyPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  const properties = await getProperties();
  const locales = routing.locales;

  return locales.flatMap((locale) =>
    properties.map((p) => ({
      locale,
      id: p.slug,
    }))
  );
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { locale, id } = await params;
  const property = await getPropertyById(id);
  
  if (!property) {
    return {
      title: "Property Not Found | AMP Empire",
    };
  }

  return {
    title: `${property.title || property.type} in ${property.city} | AMP Empire`,
    description: property.description || `Luxury ${property.type} located in ${property.city}.`,
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("propertyDetails");
  const tContact = await getTranslations("contact");
  const allProperties = await getProperties();
  if (!id) notFound();
  const safeId = decodeURIComponent(id).trim();
  const property = allProperties.find((p) => String(p.id).trim() === safeId || p.slug === safeId);

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Navigation */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-heading font-medium tracking-wider uppercase text-charcoal-400 hover:text-gold-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t("back")}
        </Link>

        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-heading font-semibold tracking-widest uppercase bg-gold-500/10 text-gold-500 rounded-full border border-gold-500/20">
                  {property.type}
                </span>
                {property.subtype && (
                  <span className="px-3 py-1 text-xs font-heading font-medium text-cream-200 bg-charcoal-800 rounded-full border border-charcoal-700/50">
                    {property.subtype}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-cream-100 leading-tight mb-4">
                {property.title || `${property.type} in ${property.district || property.city}`}
              </h1>
              <div className="flex items-center gap-2 text-charcoal-300 font-heading mb-6">
                <MapPin className="w-5 h-5 text-gold-500" />
                <span>
                  {[property.neighborhood, property.district, property.city, property.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-charcoal-400 text-sm font-medium">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold-500/70" /> {property.constructionyear ? `Listed/Built ${property.constructionyear}` : "Recently Listed"}</span>
                <div className="h-4 w-px bg-charcoal-700 hidden sm:block"></div>
                <button className="flex items-center gap-2 hover:text-gold-500 transition-colors"><Save className="w-4 h-4" /> Save</button>
                <button className="flex items-center gap-2 hover:text-gold-500 transition-colors"><Share2 className="w-4 h-4" /> Share</button>
              </div>
            </div>

            {/* Price Column */}
            <div className="md:text-right">
              <div className="text-sm font-heading text-charcoal-400 uppercase tracking-wider mb-1">
                {t("specs.price")}
              </div>
              <div className="text-4xl md:text-5xl font-heading font-bold text-gold-500">
                {formatPrice(property.price, property.currency)}
              </div>
              {property.price_eur && property.currency !== "EUR" && (
                <div className="text-charcoal-500 font-heading text-sm mt-1">
                  ~ {formatPrice(property.price_eur, "EUR")}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Gallery */}
        <section className="mb-16">
          <PropertyGallery images={property.images} />
        </section>

        {/* Key Specs Bar & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms > 0 && (
                <div className="glass p-4 rounded-xl border border-charcoal-700/30 flex flex-col items-center justify-center text-center gap-2">
                  <Bed className="w-6 h-6 text-gold-500/70" />
                  <span className="text-2xl font-heading font-bold text-cream-100">{property.bedrooms}</span>
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider">{t("specs.bedrooms")}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="glass p-4 rounded-xl border border-charcoal-700/30 flex flex-col items-center justify-center text-center gap-2">
                  <Bath className="w-6 h-6 text-gold-500/70" />
                  <span className="text-2xl font-heading font-bold text-cream-100">{property.bathrooms}</span>
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider">{t("specs.bathrooms")}</span>
                </div>
              )}
              {property.size > 0 && (
                <div className="glass p-4 rounded-xl border border-charcoal-700/30 flex flex-col items-center justify-center text-center gap-2">
                  <Expand className="w-6 h-6 text-gold-500/70" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-heading font-bold text-cream-100">{property.size}</span>
                    <span className="text-sm text-gold-500">m²</span>
                  </div>
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider">{t("specs.size")}</span>
                </div>
              )}
              {property.constructionyear && (
                <div className="glass p-4 rounded-xl border border-charcoal-700/30 flex flex-col items-center justify-center text-center gap-2">
                  <Calendar className="w-6 h-6 text-gold-500/70" />
                  <span className="text-2xl font-heading font-bold text-cream-100">{property.constructionyear}</span>
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider">{t("specs.year")}</span>
                </div>
              )}
              {!property.constructionyear && property.floor !== undefined && (
                <div className="glass p-4 rounded-xl border border-charcoal-700/30 flex flex-col items-center justify-center text-center gap-2">
                  <Layers className="w-6 h-6 text-gold-500/70" />
                  <span className="text-2xl font-heading font-bold text-cream-100">{property.floor}</span>
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider">{t("specs.floor")}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-heading font-bold text-cream-100">{t("overview")}</h2>
                  <div className="h-px bg-gold-500/20 flex-1" />
                </div>
                <div className="prose prose-invert prose-gold max-w-none text-charcoal-300 leading-relaxed font-sans">
                  {/* Safely rendering description assuming it's text or basic HTML from XML */}
                  <div dangerouslySetInnerHTML={{ __html: property.description.replace(/\n/g, "<br/>") }} />
                </div>
              </section>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-heading font-bold text-cream-100">{t("features")}</h2>
                  <div className="h-px bg-gold-500/20 flex-1" />
                </div>
                <PropertyFeatures features={property.features} />
              </section>
            )}
            
            {/* Address */}
            {property.address && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-heading font-bold text-cream-100">{t("location")}</h2>
                  <div className="h-px bg-gold-500/20 flex-1" />
                </div>
                <div className="rounded-2xl overflow-hidden bg-charcoal-800/20 border border-charcoal-700/30 shadow-lg shadow-charcoal-900/40">
                  <div className="p-4 bg-charcoal-900/50 border-b border-charcoal-700/30 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <p className="text-cream-200 font-medium text-sm sm:text-base leading-tight">
                      {property.address}
                    </p>
                  </div>
                  <div className="w-full h-[400px] bg-charcoal-900/50 relative">
                    <iframe
                      title={`Map showing ${property.address}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div>
            <div className="sticky top-32 glass p-8 rounded-2xl border border-charcoal-700/50 shadow-2xl shadow-charcoal-950/50">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-6">
                 <span className="font-heading font-bold text-charcoal-900 text-2xl">AE</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-cream-100 mb-2">AMP Empire</h3>
              <p className="text-sm text-charcoal-400 mb-8 border-b border-charcoal-700/50 pb-6">
                Premium Real Estate Advisory & Investment Corridors. Contact us to learn more about this exclusive property.
              </p>
              
              <div className="flex flex-col gap-4">
                <Button href="/contact" size="lg" className="w-full">
                  {t("contactAgent")}
                </Button>
                
                <a
                  href={`https://wa.me/${tContact("phone").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I am interested in property: ${property.title || property.type}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-heading font-semibold tracking-wide transition-all bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/20 border border-[#25D366]/30"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Properties */}
        <SimilarProperties 
          currentPropertyId={property.id} 
          properties={allProperties} 
          type={property.type} 
          city={property.city} 
        />
      </div>
    </main>
  );
}
