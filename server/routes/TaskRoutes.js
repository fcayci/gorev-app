var express = require('express');
var router = express.Router();
var TaskController = require('../controllers/TaskController.js');

/*
 * GET
 */
router.get('/', TaskController.list);

/*
 * GET
 */
router.get('/:id', TaskController.show);

/*
 * GET
 */
router.get('/user/:id', TaskController.showUser);

/*
 * POST
 */
router.post('/', TaskController.create);

/*
 * PUT
 */
router.put('/:id', TaskController.update);

/*
 * DELETE
 */
router.delete('/:id', TaskController.remove);

module.exports = router;
