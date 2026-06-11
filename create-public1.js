const fs = require("fs");
const dir = "E:/Web-Masjid/frontend/src/pages/public/";

// AboutPage.jsx
fs.writeFileSync(dir + "AboutPage.jsx", `import { useState, useEffect } from "react";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { aboutService, getImageUrl } from "../../services";
import { FiEye, FiTarget, FiBookOpen } from "react-icons/fi";

const AboutPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await aboutService.get();
        if (res.data) setData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen"><Navbar /><Breadcrumb items={[{label:"Tentang Masjid"}]} /><div className="flex items-center justify-center h-64 pt-36"><div className="spinner w-16 h-16"></div></div><Footer /></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Breadcrumb items={[{label:"Tentang Masjid"}]} />
      <div className="pt-36">
        {/* Hero Section */}
        {data?.mosqueImage && (
          <div className="w-full h-[400px] relative">
            <img src={getImageUrl(data.mosqueImage)} alt="Masjid" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        )}

        <div className="container mx-auto px-4 py-16 space-y-16">
          {/* Sejarah */}
          {data?.history && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <FiBookOpen className="w-8 h-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sejarah Masjid</h2>
              </div>
              <div className="card prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{data.history}</p>
              </div>
            </div>
          )}

          {/* Visi & Misi */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {data?.vision && (
              <div className="card card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <FiEye className="w-8 h-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Visi</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{data.vision}</p>
              </div>
            )}
            {data?.mission && (
              <div className="card card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <FiTarget className="w-8 h-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Misi</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{data.mission}</p>
              </div>
            )}
          </div>

          {/* Struktur Organisasi */}
          {data?.organizationChart && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Struktur Organisasi DKM</h2>
              <div className="card">
                <img src={getImageUrl(data.organizationChart)} alt="Struktur Organisasi" className="w-full rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;`);

console.log("AboutPage.jsx done!");
