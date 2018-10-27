const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db');
const valid = require("./valid").valid;

router.use(bodyParser.json());

router.get('/readall', (req, res) => {
	db.Fleet.findAll().then((result) => {
		res.json(result);
	});
});

router.get('/read/:id', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		console.log("readFleet");
		db.Fleet.findById(req.params.id).then((fleet) => {
			if (res.length < 1 || res.deletedAt === null)
			{
				console.log("404");
				res.statusCode = 404;
				res.json({error: "404 - not found"});
			}
			else
			{
				res.json(fleet);
			}
		});
	}
	else
	{
		res.json({ 'error': err });
	}
});

router.post('/create', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		console.log("createFleet");
		db.Fleet.create({'name': req.body.name}).then((fleet) => {
			res.json(fleet);
		});
	}
	else
	{
		res.json({ 'error': err });
	}
});

router.post('/update', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		db.Fleet.update(
			{
				'name': req.body.name
			},
			{
				where: {
					id: req.body.id,
					deletedAt: null
				}
			}).then((result) => {
				console.log(result);
				if (result.length < 1)
				{
					console.log("400");
					res.statusCode = 400;
					res.json({error: "400 - bad request"});
				}
				else
				{
					db.Fleet.findById(req.body.id).then((fleet) => {
						res.json(fleet);
					});
				}
		});
	}
	else
	{
		res.json({ 'error': err });
	}
});

router.post('/delete', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		db.Fleet.findById(req.body.id).then((result) => {
			if (!result)
			{
				console.log("400");
				resp.statusCode = 400;
				resp.json({error: "400 - bad request"});
			}
			else
			{
				db.Fleet.destroy({
					where: {
						id: req.body.id,
						deletedAt: null
					}
				}).then(() => {
					res.json(result);
				});
			}
		});
	}
	else
	{
		res.json({ 'error': err });
	}
});

module.exports = router;