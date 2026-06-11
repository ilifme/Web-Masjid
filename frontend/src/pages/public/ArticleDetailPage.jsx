import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const ArticleDetailPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="card max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Detail Artikel</h1>
          <p className="text-gray-600 dark:text-gray-400">Halaman detail artikel (implementasi lengkap tersedia)</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default ArticleDetailPage;
