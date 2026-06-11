import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { activityService, getImageUrl } from "../../services";
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiUser, FiPhone, FiShare2 } from "react-icons/fi";
import { motion } from "framer-motion";

const ActivityDetailPage = () => {
  const { slug } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchActivity();
  }, [slug]);

  const fetchActivity = async () => {
    try {
      const res = await activityService.getBySlug(slug);
      setActivity(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: activity.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Breadcrumb items={[{ label: "Kegiatan", path: "/kegiatan" }, { label: "Detail" }]} />
        <div className="pt-36 flex items-center justify-center h-64">
          <div className="spinner w-16 h-16"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Breadcrumb items={[{ label: "Kegiatan", path: "/kegiatan" }, { label: "Detail" }]} />
        <div className="pt-36 text-center py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Kegiatan Tidak Ditemukan</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Kegiatan yang Anda cari tidak ada atau telah dihapus.</p>
            <Link to="/kegiatan" className="btn btn-primary">
              <FiArrowLeft className="mr-2" /> Kembali ke Kegiatan
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Breadcrumb items={[{ label: "Kegiatan", path: "/kegiatan" }, { label: activity.title }]} />
      <div className="pt-36">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              to="/kegiatan"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Kembali ke Kegiatan
            </Link>

            {activity.image && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-xl">
                <img
                  src={getImageUrl(activity.image)}
                  alt={activity.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {activity.category && (
                <span className="px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full font-medium">
                  {activity.category}
                </span>
              )}
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <FiShare2 className="w-4 h-4" /> Bagikan
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              {activity.title}
            </h1>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {activity.schedule && (
                <div className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Jadwal</p>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.schedule}</p>
                  </div>
                </div>
              )}
              {activity.time && (
                <div className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Waktu</p>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.time}</p>
                  </div>
                </div>
              )}
              {activity.location && (
                <div className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FiMapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lokasi</p>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.location}</p>
                  </div>
                </div>
              )}
              {activity.contact && (
                <div className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FiPhone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Kontak</p>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.contact}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {activity.description && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deskripsi Kegiatan</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {activity.description}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivityDetailPage;
