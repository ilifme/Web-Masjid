import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { articleService, getImageUrl } from "../../services";
import { FiCalendar, FiClock, FiArrowLeft, FiShare2 } from "react-icons/fi";
import { motion } from "framer-motion";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const res = await articleService.getBySlug(slug);
      setArticle(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Breadcrumb items={[{ label: "Artikel", path: "/artikel" }, { label: "Detail" }]} />
        <div className="pt-36 flex items-center justify-center h-64">
          <div className="spinner w-16 h-16"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Breadcrumb items={[{ label: "Artikel", path: "/artikel" }, { label: "Detail" }]} />
        <div className="pt-36 text-center py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artikel Tidak Ditemukan</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Artikel yang Anda cari tidak ada atau telah dihapus.</p>
            <Link to="/artikel" className="btn btn-primary">
              <FiArrowLeft className="mr-2" /> Kembali ke Artikel
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
      <Breadcrumb items={[{ label: "Artikel", path: "/artikel" }, { label: article.title }]} />
      <div className="pt-36">
        <article className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Link
              to="/artikel"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Kembali ke Artikel
            </Link>

            {/* Thumbnail */}
            {article.thumbnail && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-xl">
                <img
                  src={getImageUrl(article.thumbnail)}
                  alt={article.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {article.category && (
                <span className="px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full font-medium">
                  {article.category}
                </span>
              )}
              {article.createdAt && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar className="w-4 h-4" />
                  {new Date(article.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              )}
              {article.createdAt && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="w-4 h-4" />
                  {new Date(article.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              )}
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <FiShare2 className="w-4 h-4" /> Bagikan
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              {article.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {article.content && (
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}
            </div>
          </motion.div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
