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
router.get('/open', TaskController.listopen);


/*
 * GET
 */
router.get('/:id', TaskController.show);

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
