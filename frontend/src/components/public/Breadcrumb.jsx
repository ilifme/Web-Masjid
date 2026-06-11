import { Link } from "react-router-dom";
import { FiChevronRight, FiHome, FiArrowUp } from "react-icons/fi";

const Breadcrumb = ({ items, showBackTop = true }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-20 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiHome className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            {items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Back to Top */}
          {showBackTop && (
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiArrowUp className="w-4 h-4" />
              <span>Kembali ke atas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
