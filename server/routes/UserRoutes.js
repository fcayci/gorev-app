var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

/*
 * GET
 */
router.get('/', UserController.list);

/*
 * GET
 */
router.get('/:id', UserController.show);

/*
 * GET
 */
//router.get('/:id/busy', UserController.showBusy);

/*
 * GET
 */
//router.get('/:id/task', UserController.showTask);

/*
 * POST
 */
router.post('/', UserController.create);

/*
 * PUT
 */
router.put('/:id', UserController.update);

/*
 * DELETE
 */
router.delete('/:id', UserController.remove);

module.exports = router;
