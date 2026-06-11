import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import {
  FiUsers,
  FiFileText,
  FiCalendar,
  FiCamera,
  FiDollarSign,
  FiEye,
  FiTrendingUp,
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total User',
      value: stats?.stats?.users || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Artikel',
      value: stats?.stats?.articles || 0,
      icon: FiFileText,
      color: 'bg-green-500',
      lightColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      subtitle: `${stats?.stats?.publishedArticles || 0} Published`,
    },
    {
      title: 'Total Kegiatan',
      value: stats?.stats?.activities || 0,
      icon: FiCalendar,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      subtitle: `${stats?.stats?.activeActivities || 0} Aktif`,
    },
    {
      title: 'Total Galeri',
      value: stats?.stats?.galleries || 0,
      icon: FiCamera,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      subtitle: `${stats?.stats?.photos || 0} Foto`,
    },
    {
      title: 'Campaign Aktif',
      value: stats?.stats?.activeCampaigns || 0,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selamat datang di panel administrator
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="card card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>

                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </div>

                <div className={`p-4 rounded-xl ${stat.lightColor}`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Summary */}
      {stats?.donationSummary && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Ringkasan Donasi
            </h2>

            <FiTrendingUp className="text-primary-600 dark:text-primary-400 w-6 h-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Target Total
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Rp{' '}
                {parseFloat(
                  stats.donationSummary.totalTarget || 0
                ).toLocaleString('id-ID')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Terkumpul
              </p>

              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Rp{' '}
                {parseFloat(
                  stats.donationSummary.totalCollected || 0
                ).toLocaleString('id-ID')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Persentase
              </p>

              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.donationSummary.percentage}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    stats.donationSummary.percentage,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artikel */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Artikel Terbaru
          </h2>

          <div className="space-y-4">
            {stats?.recentArticles?.length > 0 ? (
              stats.recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {article.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">
                        {article.status}
                      </span>

                      <span className="flex items-center">
                        <FiEye className="mr-1" />
                        {article.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Belum ada artikel
              </p>
            )}
          </div>
        </div>

        {/* Kegiatan */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Kegiatan Terbaru
          </h2>

          <div className="space-y-4">
            {stats?.recentActivities?.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {activity.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">
                        {activity.category}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          activity.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {activity.isActive
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Belum ada kegiatan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;