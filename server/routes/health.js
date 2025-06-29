const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        server: {
          status: 'operational',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          platform: process.platform,
          nodeVersion: process.version
        },
        openai_api: {
          status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured'
        }
      }
    };

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 