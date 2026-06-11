import { useState, useEffect } from "react";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { articleService, getImageUrl } from "../../services";
import { Link } from "react-router-dom";
import { FiCalendar, FiArrowRight, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchArticles();
  }, [page, category]);

  const fetchArticles = async () => {
    try {
      const params = { page, limit: 9 };
      if (category) params.category = category;
      const res = await articleService.getPublished(params);
      setArticles(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const categories = [
    { value: "", label: "Semua" },
    { value: "berita", label: "Berita" },
    { value: "artikel", label: "Artikel" },
    { value: "pengumuman", label: "Pengumuman" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Breadcrumb items={[{ label: "Artikel" }]} />
      <div className="pt-36">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Artikel & Berita
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Baca artikel dan berita terbaru seputar kegiatan masjid dan keislaman
            </p>
          </motion.div>

          {/* Filter & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { setCategory(cat.value); setPage(1); }}
                  className={"px-4 py-2 rounded-full text-sm font-medium transition-all " + (
                    category === cat.value
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 md:ml-auto">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </form>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="spinner w-16 h-16"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada artikel</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={"/artikel/" + article.slug}
                      className="card card-hover flex flex-col h-full group"
                    >
                      {article.thumbnail && (
                        <div className="relative overflow-hidden rounded-lg mb-4">
                          <img
                            src={getImageUrl(article.thumbnail)}
                            alt={article.title}
                            className="w-full h-52 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        {article.category && (
                          <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                            {article.category}
                          </span>
                        )}
                        {article.createdAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {new Date(article.createdAt).toLocaleDateString("id-ID", {
                              year: "numeric", month: "long", day: "numeric"
                            })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex-grow group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {article.excerpt || article.content?.substring(0, 150)}
                      </p>
                      <div className="flex items-center text-primary-600 font-medium text-sm mt-auto">
                        Baca Selengkapnya <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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

export default ArticlesPage;
