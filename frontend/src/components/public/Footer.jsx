import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { settingService, getImageUrl } from "../../services";
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingService.getPublic();
        if (res.data) setSettings(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const s = settings;
  const siteName = s.site_name || "Masjid Quba";
  const siteDesc = s.site_description || "Pusat kegiatan keagamaan dan sosial masyarakat.";
  const address = s.address || "Jl. Contoh No. 123, Jakarta";
  const phone = s.phone || "021-12345678";
  const email = s.email || "info@masjid.com";
  const facebook = s.facebook || "https://facebook.com";
  const instagram = s.instagram || "https://instagram.com";
  const youtube = s.youtube || "https://youtube.com";
  const footerLogo = s.footer_logo || null;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {footerLogo ? (
                <img src={getImageUrl(footerLogo)} alt={siteName} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{siteName.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-white text-lg">{siteName}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">{siteDesc}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Menu Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tentang" className="hover:text-primary-400">Tentang Kami</Link></li>
              <li><Link to="/artikel" className="hover:text-primary-400">Artikel</Link></li>
              <li><Link to="/kegiatan" className="hover:text-primary-400">Kegiatan</Link></li>
              <li><Link to="/galeri" className="hover:text-primary-400">Galeri</Link></li>
              <li><Link to="/donasi" className="hover:text-primary-400">Donasi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-white mb-4">Sosial Media</h4>
            <div className="flex items-center space-x-4">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <FiFacebook />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <FiInstagram />
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <FiYoutube />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;