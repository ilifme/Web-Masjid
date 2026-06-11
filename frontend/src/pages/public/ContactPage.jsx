import { useState, useEffect } from "react";
import Navbar from "../../components/public/Navbar";
import Breadcrumb from "../../components/public/Breadcrumb";
import Footer from "../../components/public/Footer";
import { settingService, getImageUrl } from "../../services";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";

const ContactPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingService.getPublic();
      setSettings(res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Breadcrumb items={[{ label: "Kontak" }]} />
        <div className="pt-36 flex items-center justify-center h-64">
          <div className="spinner w-16 h-16"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const address = settings.address || "Masjid Quba, Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota";
  const phone = settings.phone || "(021) 1234-5678";
  const email = settings.email || "info@masjidalikhlas.com";
  const mapsEmbed = settings.maps_embed || "";

  return (
    <div className="min-h-screen">
      <Navbar />
      <Breadcrumb items={[{ label: "Kontak" }]} />
      <div className="pt-36">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Kontak Kami
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hubungi kami untuk informasi lebih lanjut tentang kegiatan masjid
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="card card-hover flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Alamat</h3>
                  <p className="text-gray-600 dark:text-gray-400">{address}</p>
                </div>
              </div>

              <div className="card card-hover flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Telepon</h3>
                  <a
                    href={"tel:" + phone}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="card card-hover flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                  <a
                    href={"mailto:" + email}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              {settings.opening_hours && (
                <div className="card card-hover flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <FiClock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Jam Operasional</h3>
                    <p className="text-gray-600 dark:text-gray-400">{settings.opening_hours}</p>
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              {(settings.facebook || settings.instagram || settings.youtube || settings.tiktok) && (
                <div className="card">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Ikuti Kami</h3>
                  <div className="flex flex-wrap gap-3">
                    {settings.facebook && (
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Facebook
                      </a>
                    )}
                    {settings.instagram && (
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                      >
                        Instagram
                      </a>
                    )}
                    {settings.youtube && (
                      <a
                        href={settings.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        YouTube
                      </a>
                    )}
                    {settings.tiktok && (
                      <a
                        href={settings.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                      >
                        TikTok
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Maps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              <div className="card h-full">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Lokasi Masjid</h3>
                {mapsEmbed ? (
                  <div className="rounded-xl overflow-hidden h-[400px]">
                    <iframe
                      src={mapsEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokasi Masjid"
                    ></iframe>
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">{address}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
