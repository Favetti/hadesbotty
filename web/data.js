const express = require('express');
const router = express.Router();


// Routes
router.get('/', (err, res) => {
	res.render('index', (err, html) => {
		if (err) throw err;

		res.send(html);
	});
});

router.post('/', upload.single('fileUpload'), (req, res) => {
	res.status(200).json({ "size": req.file.size });
});

module.exports = router;

