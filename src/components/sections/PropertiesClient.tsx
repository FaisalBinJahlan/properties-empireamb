"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight, Filter, SortAsc, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { Property } from "@/lib/types";

interface PropertiesClientProps {
  properties: Property[];
}

export default function PropertiesClient({ properties }: PropertiesClientProps) {
  const t = useTranslations("properties");

  const [filterCountry, setFilterCountry] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const countries = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.country).filter(Boolean)));
  }, [properties]);

  const types = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.type).filter(Boolean)));
  }, [properties]);

  const filteredAndSorted = useMemo(() => {
    let result = [...properties];

    if (filterCountry !== "all") {
      result = result.filter((p) => p.country === filterCountry);
    }
    if (filterType !== "all") {
      result = result.filter((p) => p.type === filterType);
    }

    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "oldest") {
      result.reverse();
    }
    // "newest" implies retaining standard feed order.
    
    return result;
  }, [properties, filterCountry, filterType, sortOption]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const scrollToTop = () => {
    const element = document.getElementById("properties");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setTimeout(scrollToTop, 100);
  };

  return (
    <section id="properties" className="section-padding relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-gradient-to-tl from-gold-500/3 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          label={t("sectionLabel")}
          title={t("headline")}
          subtitle={t("subtitle")}
        />

        {properties.length > 0 ? (
          <>
            {/* Filter Bar */}
            <div className="mt-8 glass p-6 rounded-2xl border border-charcoal-700/50 shadow-xl mb-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Filter className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  <span className="font-heading font-semibold text-cream-100 uppercase tracking-wider text-sm hidden lg:block">Filter</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full flex-1">
                  <select
                    className="w-full bg-charcoal-900/50 border border-charcoal-700 text-charcoal-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 appearance-none font-medium"
                    value={filterCountry}
                    onChange={(e) => handleFilterChange(setFilterCountry, e.target.value)}
                  >
                    <option value="all">All Countries</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    className="w-full bg-charcoal-900/50 border border-charcoal-700 text-charcoal-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 appearance-none font-medium"
                    value={filterType}
                    onChange={(e) => handleFilterChange(setFilterType, e.target.value)}
                  >
                    <option value="all">All Property Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    className="w-full bg-charcoal-900/50 border border-charcoal-700 text-charcoal-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 appearance-none font-medium"
                    value={sortOption}
                    onChange={(e) => handleFilterChange(setSortOption, e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {paginatedProperties.length > 0 ? (
                  <motion.div 
                    key={currentPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {paginatedProperties.map((property, index) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 glass rounded-2xl border border-charcoal-800"
                  >
                    <p className="text-xl text-charcoal-400 font-heading">No properties found matching your criteria.</p>
                    <button onClick={() => {setFilterCountry('all'); setFilterType('all'); setCurrentPage(1);}} className="mt-4 text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-widest text-sm font-semibold">Clear Filters</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-charcoal-700/50 text-charcoal-400 hover:text-gold-500 hover:border-gold-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2 mx-4">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show only first, last, and relative pages for brevity
                    if (totalPages > 7 && page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                      if (Math.abs(page - currentPage) === 2) return <span key={page} className="text-charcoal-600">...</span>;
                      return null;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-xl font-heading font-bold text-sm transition-all ${
                          currentPage === page
                            ? "bg-gold-500 text-charcoal-900 shadow-lg shadow-gold-500/20"
                            : "bg-charcoal-800/40 text-charcoal-400 hover:text-gold-500 hover:border-gold-500/30 border border-charcoal-700/30"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border border-charcoal-700/50 text-charcoal-400 hover:text-gold-500 hover:border-gold-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Elegant placeholder when no feed configured */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative bg-charcoal-800/40 backdrop-blur-sm rounded-2xl border border-charcoal-700/30 overflow-hidden group hover:border-gold-500/20 transition-all duration-500"
              >
                {/* Placeholder Image Area */}
                <div className="h-64 bg-gradient-to-br from-charcoal-700/50 to-charcoal-800/50 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-charcoal-600/50" />
                </div>

                {/* Placeholder Content */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-charcoal-700/50 rounded-full" />
                    <div className="h-3 w-16 bg-charcoal-700/50 rounded-full" />
                  </div>
                  <div className="h-5 w-3/4 bg-charcoal-700/30 rounded-full" />
                  <div className="gold-line" />
                  <div className="flex gap-4">
                    <div className="h-3 w-14 bg-charcoal-700/40 rounded-full" />
                    <div className="h-3 w-14 bg-charcoal-700/40 rounded-full" />
                    <div className="h-3 w-14 bg-charcoal-700/40 rounded-full" />
                  </div>
                </div>

                {/* Coming Soon Badge */}
                <div className="absolute top-4 start-4 bg-charcoal-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gold-500/20">
                  <span className="text-gold-500/60 font-heading font-semibold text-xs tracking-wider uppercase">
                    {t("comingSoon")}
                  </span>
                </div>
              </div>
            ))}

            {/* Message overlay */}
            <div className="md:col-span-3 text-center mt-4">
              <p className="text-charcoal-400 text-sm">
                {t("noProperties")}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
