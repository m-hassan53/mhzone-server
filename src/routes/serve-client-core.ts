import express from 'express';
import path from 'path';
const router = express.Router();
const allowedExtAndFiles = ['.js', '.ico', '.css', 'robots.txt', 'sitemap.xml'];

router.get('*', (req, res) => {
  if (allowedExtAndFiles.filter((ext) => req.originalUrl.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`server/dist/client/${req.originalUrl}`));
  } else {
    res.sendFile(path.resolve('server/dist/client/index.html'));
  }
});

export = router;
