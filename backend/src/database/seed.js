const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const models = require('../models');

const seed = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Create Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await models.User.create({
      username: 'superadmin',
      email: 'admin@masjid.com',
      password: hashedPassword,
      fullName: 'Super Administrator',
      role: 'super_admin',
      isActive: true,
    });
    
    console.log('✓ Super Admin created');
    
    // Create About data
    await models.About.create({
      history: 'Masjid ini didirikan pada tahun 1990 dengan tujuan menjadi pusat kegiatan keagamaan dan sosial masyarakat.',
      vision: 'Menjadi masjid yang rahmatan lil alamin, memberikan manfaat bagi umat dan masyarakat sekitar.',
      mission: 'Menyelenggarakan kegiatan ibadah, pendidikan, dan sosial yang berkualitas untuk kemajuan umat Islam.',
    });
    
    console.log('✓ About data created');
    
    // Create Prayer Time Settings
    await models.PrayerTime.create({
      city: 'Jakarta',
      country: 'Indonesia',
      latitude: -6.2088,
      longitude: 106.8456,
      method: 2,
      timezone: 'Asia/Jakarta',
    });
    
    console.log('✓ Prayer Time settings created');
    
    // Create Banner
    await models.Banner.create({
      title: 'Selamat Datang di Masjid Kami',
      description: 'Mari bergabung dalam kegiatan keagamaan dan sosial di masjid kami',
      image: '/uploads/default-banner.jpg',
      ctaText: 'Lihat Kegiatan',
      ctaLink: '/kegiatan',
      isActive: true,
      order: 1,
    });
    
    console.log('✓ Banner created');
    
    // Create Settings
    const settings = [
      { key: 'site_name', value: 'Masjid Al-Ikhlas', type: 'text', group: 'general', label: 'Nama Website' },
      { key: 'site_description', value: 'Website Resmi Masjid Al-Ikhlas', type: 'text', group: 'general', label: 'Deskripsi Website' },
      { key: 'address', value: 'Jl. Contoh No. 123, Jakarta', type: 'textarea', group: 'contact', label: 'Alamat' },
      { key: 'phone', value: '021-12345678', type: 'text', group: 'contact', label: 'Telepon' },
      { key: 'email', value: 'info@masjid.com', type: 'text', group: 'contact', label: 'Email' },
      { key: 'facebook', value: 'https://facebook.com/masjid', type: 'text', group: 'social', label: 'Facebook' },
      { key: 'instagram', value: 'https://instagram.com/masjid', type: 'text', group: 'social', label: 'Instagram' },
      { key: 'youtube', value: 'https://youtube.com/masjid', type: 'text', group: 'social', label: 'YouTube' },
      { key: 'maps_embed', value: '', type: 'textarea', group: 'contact', label: 'Google Maps Embed' },
    ];
    
    await models.Setting.bulkCreate(settings);
    
    console.log('✓ Settings created');
    
    // Create Sample Article
    await models.Article.create({
      title: 'Sejarah Masjid Al-Ikhlas',
      slug: 'sejarah-masjid-al-ikhlas',
      content: 'Ini adalah artikel tentang sejarah masjid...',
      excerpt: 'Sejarah singkat masjid Al-Ikhlas',
      category: 'Sejarah',
      status: 'published',
      publishedAt: new Date(),
      authorId: 1,
    });
    
    console.log('✓ Sample article created');
    
    // Create Sample Activity
    await models.Activity.create({
      title: 'Kajian Rutin Mingguan',
      slug: 'kajian-rutin-mingguan',
      description: 'Kajian rutin setiap minggu membahas tema keislaman',
      category: 'kajian',
      schedule: 'Setiap Minggu, 19:00 WIB',
      location: 'Masjid Al-Ikhlas',
      isActive: true,
    });
    
    console.log('✓ Sample activity created');
    
    // Create Sample Announcement
    await models.Announcement.create({
      title: 'Pengumuman Penting',
      content: 'Ini adalah pengumuman penting dari masjid',
      type: 'running_text',
      priority: 1,
      isActive: true,
    });
    
    console.log('✓ Sample announcement created');
    // Create DKM Management
    await models.Management.bulkCreate([
      { name: "Ustadz Ahmad Fauzi", position: "Ketua DKM", description: "Ketua Dewan Kemakmuran Masjid", order: 1 },
      { name: "H. Bapak Suryadi", position: "Wakil Ketua", description: "Wakil Ketua DKM", order: 2 },
      { name: "Bapak Rudi Hartono", position: "Sekretaris", description: "Sekretaris DKM", order: 3 },
      { name: "Bapak Agus Wijaya", position: "Bendahara", description: "Bendahara DKM", order: 4 },
      { name: "Ustadz Muhammad Amin", position: "Ketua Bidang Dakwah", description: "Koordinator kegiatan dakwah", order: 5 },
      { name: "Bapak Dedi Kurniawan", position: "Ketua Bidang Pendidikan", description: "Koordinator pendidikan", order: 6 },
      { name: "Bapak Hendra Gunawan", position: "Ketua Bidang Sosial", description: "Koordinator kegiatan sosial", order: 7 },
      { name: "Bapak Firmansyah", position: "Ketua Bidang Pembangunan", description: "Koordinator pembangunan masjid", order: 8 },
    ]);
    console.log('✓ DKM Management created');

    
    console.log('\n=================================');
    console.log('Database seeding completed!');
    console.log('=================================');
    console.log('Login credentials:');
    console.log('Email: admin@masjid.com');
    console.log('Password: admin123');
    console.log('=================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
