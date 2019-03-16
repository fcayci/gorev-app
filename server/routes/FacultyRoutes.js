var express = require('express');
var router = express.Router();
var FacultyController = require('../controllers/FacultyController.js');

/*
 * GET
 */
router.get('/', FacultyController.list);

/*
 * GET
 */
router.get('/:id', FacultyController.show);

/*
 * POST
 */
router.post('/', FacultyController.create);

/*
 * PUT
 */
router.put('/:id', FacultyController.update);

/*
 * DELETE
 */
router.delete('/:id', FacultyController.remove);

module.exports = router;
