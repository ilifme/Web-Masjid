import { useState, useEffect } from "react";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { galleryService, getImageUrl } from "../../services";
import { FiX, FiChevronLeft, FiChevronRight, FiImage, FiVideo } from "react-icons/fi";
import { motion } from "framer-motion";

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await galleryService.getAll({ limit: 50 });
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeFilter === "all"
    ? items
    : items.filter((item) => item.type === activeFilter);

  const openLightbox = (item, index) => {
    setLightbox({ item, index });
  };

  const closeLightbox = () => {
    setLightbox(null);
  };

  const nextImage = () => {
    const filtered = filteredItems.filter((i) => i.type === "photo");
    const currentIdx = filtered.findIndex((i) => i.id === lightbox.item.id);
    const nextIdx = (currentIdx + 1) % filtered.length;
    setLightbox({ item: filtered[nextIdx], index: nextIdx });
  };

  const prevImage = () => {
    const filtered = filteredItems.filter((i) => i.type === "photo");
    const currentIdx = filtered.findIndex((i) => i.id === lightbox.item.id);
    const prevIdx = (currentIdx - 1 + filtered.length) % filtered.length;
    setLightbox({ item: filtered[prevIdx], index: prevIdx });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const filters = [
    { value: "all", label: "Semua" },
    { value: "photo", label: "Foto" },
    { value: "video", label: "Video" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Breadcrumb items={[{ label: "Galeri" }]} />
      <div className="pt-36">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Galeri
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dokumentasi foto dan video kegiatan masjid
            </p>
          </motion.div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={"px-4 py-2 rounded-full text-sm font-medium transition-all " + (
                  activeFilter === f.value
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="spinner w-16 h-16"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada galeri</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
                  onClick={() => item.type === "photo" ? openLightbox(item, index) : null}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                      <img
                        src={item.thumbnail ? getImageUrl(item.thumbnail) : "/video-placeholder.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                          <FiVideo className="w-8 h-8 text-primary-600 ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(item.url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {item.title && (
                        <p className="text-white font-medium text-sm truncate">{item.title}</p>
                      )}
                      {item.category && (
                        <p className="text-gray-300 text-xs mt-1">{item.category}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && lightbox.item.type === "photo" && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <FiX className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <FiChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <FiChevronRight className="w-10 h-10" />
          </button>

          <img
            src={getImageUrl(lightbox.item.url)}
            alt={lightbox.item.title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {lightbox.item.title && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
              <p className="text-lg font-medium">{lightbox.item.title}</p>
              {lightbox.item.category && (
                <p className="text-sm text-gray-300">{lightbox.item.category}</p>
              )}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
