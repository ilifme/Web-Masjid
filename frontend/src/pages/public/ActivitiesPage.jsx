import { useState, useEffect } from "react";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { activityService, getImageUrl } from "../../services";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActivities();
  }, [page, activeCategory]);

  const fetchActivities = async () => {
    try {
      const params = { page, limit: 8 };
      if (activeCategory) params.category = activeCategory;
      const res = await activityService.getActive(params);
      setActivities(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "", label: "Semua" },
    { value: "kajian", label: "Kajian" },
    { value: "sosial", label: "Sosial" },
    { value: "pendidikan", label: "Pendidikan" },
    { value: "ramadhan", label: "Ramadhan" },
    { value: "lainnya", label: "Lainnya" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Breadcrumb items={[{ label: "Kegiatan" }]} />
      <div className="pt-36">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Kegiatan Masjid
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ikuti berbagai kegiatan keagamaan, sosial, dan pendidikan di masjid kami
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setActiveCategory(cat.value); setPage(1); }}
                className={"px-4 py-2 rounded-full text-sm font-medium transition-all " + (
                  activeCategory === cat.value
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Activities Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="spinner w-16 h-16"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada kegiatan</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={"/kegiatan/" + activity.slug}
                      className="card card-hover flex flex-col h-full group"
                    >
                      {activity.image && (
                        <div className="relative overflow-hidden rounded-lg mb-4">
                          <img
                            src={getImageUrl(activity.image)}
                            alt={activity.title}
                            className="w-full h-48 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full mb-3">
                        {activity.category}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex-grow group-hover:text-primary-600 transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                      {activity.schedule && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <FiCalendar className="mr-2 w-4 h-4" />
                          {activity.schedule}
                        </div>
                      )}
                      {activity.location && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <FiMapPin className="mr-2 w-4 h-4" />
                          {activity.location}
                        </div>
                      )}
                      <div className="flex items-center text-primary-600 font-medium text-sm mt-auto">
                        Lihat Detail <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={"w-10 h-10 rounded-lg font-medium transition-all " + (
                        page === p
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
