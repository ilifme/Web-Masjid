const { Article, User } = require('../models');
const { Op } = require('sequelize');

const articleController = {
  // Get all articles
  getAll: async (req, res) => {
    try {
      const { status, category, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (status) where.status = status;
      if (category) where.category = category;
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: %% } },
          { content: { [Op.like]: %% } },
        ];
      }
      
      const { count, rows } = await Article.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'fullName', 'email'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      
      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get published articles (public)
  getPublished: async (req, res) => {
    try {
      const { category, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = { status: 'published' };
      
      if (category) where.category = category;
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: %% } },
          { content: { [Op.like]: %% } },
        ];
      }
      
      const { count, rows } = await Article.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'fullName'],
          },
        ],
        order: [['publishedAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      
      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get single article by slug
  getBySlug: async (req, res) => {
    try {
      const article = await Article.findOne({
        where: { slug: req.params.slug },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'fullName'],
          },
        ],
      });
      
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }
      
      // Increment views
      await article.increment('views');
      
      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get single article by ID
  getById: async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'fullName', 'email'],
          },
        ],
      });
      
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create article
  create: async (req, res) => {
    try {
      const { title, content, excerpt, category, tags, status } = req.body;
      
      // Generate slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const article = await Article.create({
        title,
        slug,
        content,
        excerpt,
        thumbnail: req.file ? '/' + req.file.path.replace(/\\/g, '/') : null,
        category,
        tags,
        status: status || 'draft',
        publishedAt: status === 'published' ? new Date() : null,
        authorId: req.user.id,
      });
      
      res.status(201).json({
        success: true,
        message: 'Artikel berhasil dibuat',
        data: article,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update article
  update: async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }
      
      const { title, content, excerpt, category, tags, status } = req.body;
      
      const updateData = {
        title: title || article.title,
        content: content || article.content,
        excerpt: excerpt !== undefined ? excerpt : article.excerpt,
        category: category !== undefined ? category : article.category,
        tags: tags !== undefined ? tags : article.tags,
        status: status || article.status,
      };
      
      // Update slug if title changed
      if (title && title !== article.title) {
        updateData.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      // Update thumbnail if new file uploaded
      if (req.file) {
        updateData.thumbnail = '/' + req.file.path.replace(/\\/g, '/');
      }
      
      // Update published date if status changed to published
      if (status === 'published' && article.status !== 'published') {
        updateData.publishedAt = new Date();
      }
      
      await article.update(updateData);
      
      res.json({
        success: true,
        message: 'Artikel berhasil diupdate',
        data: article,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete article
  delete: async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }
      
      await article.destroy();
      
      res.json({
        success: true,
        message: 'Artikel berhasil dihapus',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
};

module.exports = articleController;
