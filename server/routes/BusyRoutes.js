var express = require('express');
var router = express.Router();
var BusyController = require('../controllers/BusyController.js');

/*
 * GET
 */
router.get('/', BusyController.list);

/*
 * GET
 */
router.get('/:id', BusyController.show);

/*
 * GET
 */
router.get('/user/:id', BusyController.showUser);

/*
 * POST
 */
router.post('/', BusyController.create);

/*
 * PUT
 */
router.put('/:id', BusyController.update);

/*
 * DELETE
 */
router.delete('/:id', BusyController.remove);

module.exports = router;
