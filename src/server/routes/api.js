var express = require('express');
var router = express.Router();

// Require Schema model in our routes modul
var Category = require('../models/Category');
var Job = require('../models/Job');
var User = require('../models/User');

// import controller from //controllers/index.js which contains all controllers
var controllers = require('../controllers')

// List all by resource type
router.get('/:resource', function(req, res, next){
	var resource = req.params.resource;	
	var controller = controllers[resource]

	if (controller == null){
		res.json({
			confirmation: 'fail',
			message: 'Invalid api resource request: ' + resource,
			avaiableResources: 'job, user, category'
		})
		return
	}

	controller.find(req.query, function(err, results){
		if (err){
				res.json({ 
					confirmation: 'fail',
					resource: err
				})
			return;
		}
		// res.json({ confirmation: 'success',resource: results })
		res.json(results)
	})
})

// Find by id in resource type
router.get('/:resource/:id', function(req, res, next){
	var resource = req.params.resource;
	var id = req.params.id;

	var controller = controllers[resource]
	if (controller == null){
	res.json({
		confirmation: 'fail',
		message: 'Invalid api resource request: ' + resource
	})

	return
	}

	controller.findById(id, function(err, result){
		if (err){
			res.json({
				confirmation: 'fail',
				message: 'Id Not Found'
			})
			return
		}
		res.json(result)
	})
})

// Query region. Mainly for Jobs.
router.get('/:resource/region/:id', function(req, res, next){
	var resource = req.params.resource;
	var id = req.params.id;

	var controller = controllers[resource]
	if (controller == null){
	res.json({
		confirmation: 'fail',
		message: 'Invalid api resource request: ' + resource
	})

	return
	}

	controller.find({ "category.region" : new RegExp("^" + id, "i") }, function(err, result){
		if (err){
			res.json({
				confirmation: 'fail',
				message: 'Id Not Found'
			})
			return
		}
		res.json(result)
	})
})

// Query keyword. Mainly for Jobs.
router.get('/:resource/keyword/:id', function(req, res, next){
	var resource = req.params.resource;
	var id = req.params.id;

	var controller = controllers[resource]
	if (controller == null){
	res.json({
		confirmation: 'fail',
		message: 'Invalid api resource request: ' + resource
	})

	return
	}
	controller.find({ "category.keyword" : new RegExp("^" + id, "i") }, function(err, result){
		if (err){
			res.json({
				confirmation: 'fail',
				message: 'Id Not Found'
			})
			return
		}
		res.json(result)
	})
})

// Find and Update
router.post('/:resource', function(req, res, next){
	var resource = req.params.resource;
	// logic setup to read data.oauth for User model and name for Job model
	var id = req.body.data? req.body.data.oauth : req.body.name;
	console.log("resource ", resource)
	console.log("keyword ", id)
	var controller = controllers[resource]
	
	if (controller == null){
	res.json({
		confirmation: 'fail',
		message: 'Invalid api resource request: ' + resource
	})
	return
	}

	controller.findOneAndUpdate(id, req.body, function(err, result){
		if (err){
			res.json({
				confirmation: 'fail',
				message: err
			})
			return
		}
		res.json(result)
	})
})

module.exports = router;