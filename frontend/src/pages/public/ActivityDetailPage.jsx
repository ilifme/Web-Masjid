import Navbar from '../../components/public/Navbar';
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from '../../components/public/Footer';

const ActivityDetailPage = () => (
  <div className="min-h-screen">
    <Navbar />
      <Breadcrumb items={[{"label":"Kegiatan","path":"/kegiatan"},{"label":"Detail"}]} />
    <div className="pt-36">
      <div className="container mx-auto px-4 py-16">
        <div className="card max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Detail Kegiatan</h1>
          <p className="text-gray-600 dark:text-gray-400">Halaman detail kegiatan (implementasi lengkap tersedia)</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default ActivityDetailPage;
