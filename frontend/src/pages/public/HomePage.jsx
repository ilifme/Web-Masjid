import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { bannerService, articleService, activityService, prayerTimeService, announcementService, getImageUrl } from '../../services';
import { Link } from 'react-router-dom';
import { FiClock, FiCalendar, FiArrowRight, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannersRes, articlesRes, activitiesRes, prayerRes, announcementsRes] = await Promise.all([
        bannerService.getActive(),
        articleService.getPublished({ limit: 3 }),
        activityService.getActive({ limit: 4 }),
        prayerTimeService.getToday(),
        announcementService.getActive(),
      ]);

      setBanners(bannersRes.data);
      setArticles(articlesRes.data);
      setActivities(activitiesRes.data);
      setPrayerTimes(prayerRes.data);
      setAnnouncements(announcementsRes.data);

      if (prayerRes.data?.timings) {
        calculateNextPrayer(prayerRes.data.timings);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = (timings) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Subuh', time: timings.fajr },
      { name: 'Dzuhur', time: timings.dhuhr },
      { name: 'Ashar', time: timings.asr },
      { name: 'Maghrib', time: timings.maghrib },
      { name: 'Isya', time: timings.isha },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':');
      const prayerMinutes = parseInt(hours) * 60 + parseInt(minutes);

      if (prayerMinutes > currentTime) {
        setNextPrayer(prayer);
        return;
      }
    }

    setNextPrayer(prayers[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-screen">
        {banners.length > 0 ? (
          <div className="absolute inset-0">
            <img
              src={getImageUrl(banners[0].image)}
              alt={banners[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
        )}

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {banners[0]?.title || 'Selamat Datang di Masjid Al-Ikhlas'}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {banners[0]?.description || 'Mari bergabung dalam kegiatan keagamaan dan sosial'}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/kegiatan" className="btn btn-primary">
                Lihat Kegiatan
              </Link>
              <Link to="/donasi" className="btn btn-gold">
                Donasi
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Running Text Announcements */}
      {announcements.filter(a => a.type === 'running_text').length > 0 && (
        <div className="bg-primary-600 text-white py-3 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {announcements
              .filter(a => a.type === 'running_text')
              .map(a => a.content)
              .join(' • ')}
          </div>
        </div>
      )}

      {/* Prayer Times Section */}
      {prayerTimes && (
        <section className="py-16 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Jadwal Sholat Hari Ini
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {prayerTimes.date} • {prayerTimes.location?.city}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: 'Subuh', time: prayerTimes.timings.fajr },
                  { name: 'Dzuhur', time: prayerTimes.timings.dhuhr },
                  { name: 'Ashar', time: prayerTimes.timings.asr },
                  { name: 'Maghrib', time: prayerTimes.timings.maghrib },
                  { name: 'Isya', time: prayerTimes.timings.isha },
                ].map((prayer) => (
                  <div
                    key={prayer.name}
                    className={`card text-center ${nextPrayer?.name === prayer.name ? "bg-primary-600 text-white" : "bg-white dark:bg-gray-800"}`}
                  >
                    <FiClock className="w-8 h-8 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">{prayer.name}</h3>
                    <p className="text-2xl font-bold">{prayer.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Activities Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="section-title">Kegiatan Masjid</h2>
              <p className="section-subtitle">
                Ikuti berbagai kegiatan keagamaan dan sosial di masjid kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  to={/kegiatan/}
                  className="card card-hover"
                >
                  {activity.image && (
                    <img
                      src={getImageUrl(activity.image)}
                      alt={activity.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full mb-3">
                    {activity.category}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                  {activity.schedule && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="mr-2" />
                      {activity.schedule}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/kegiatan" className="btn btn-outline">
                Lihat Semua Kegiatan
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="section-title">Artikel Terbaru</h2>
              <p className="section-subtitle">
                Baca artikel dan berita terbaru seputar kegiatan masjid
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={/artikel/}
                  className="card card-hover"
                >
                  {article.thumbnail && (
                    <img
                      src={getImageUrl(article.thumbnail)}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full mb-3">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/artikel" className="btn btn-outline">
                Lihat Semua Artikel
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

