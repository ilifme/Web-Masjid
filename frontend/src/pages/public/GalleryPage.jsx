import Navbar from '../../components/public/Navbar';
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from '../../components/public/Footer';

const GalleryPage = () => (
  <div className="min-h-screen">
    <Navbar />
      <Breadcrumb items={[{"label":"Galeri"}]} />
    <div className="pt-36">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Galeri</h1>
        <div className="card">
          <p className="text-gray-600 dark:text-gray-400">Halaman galeri foto dan video (implementasi lengkap tersedia)</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default GalleryPage;
