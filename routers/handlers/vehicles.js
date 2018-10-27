const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db');

const geolib = require('geolib');
const valid = require("./valid").valid;

router.use(bodyParser.json());

router.get('/readall', (req, resp) => {
	db.Vehicle.findAll().then((result) => {
		resp.json(result);
	});
});

router.get('/readall/:fleetId', (req, resp) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.findAll({
			where: {
				fleetId: req.params.fleetId,
				deletedAt: null
			}
		}).then((result) => {
			console.log(result);
			if (result.length < 1 || result.deletedAt === null)
			{
				console.log("404");
				resp.statusCode = 404;
				resp.json({error: "404 - not found"});
			}
			else
			{
				resp.json(result);
			}
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});

router.get('/read/:id', (req, resp) => {
	let err = valid(req);
	if (err === "")
	{
		console.log(req.params.id);
		db.Vehicle.findById(req.params.id).then((result) => {
			if (result === null || result.deletedAt !== null)
			{
				console.log("404");
				resp.statusCode = 404;
				resp.json({error: "404 - not found"});
			}
			else
			{
				resp.json(result);
			}
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});

router.post('/create', (req, resp) => {
	let err = valid(req);
	if (err === "")
	{
		db.Fleet.findById(req.body.fleetId).then((result) => {
			console.log(result);
			if (result === null || result.deletedAt !== null)
			{
				console.log("404");
				resp.statusCode = 404;
				resp.json({error: "404 - not found"});
			}
			else db.Vehicle.create({
				'name': req.body.name,
				'fleetId': req.body.fleetId
			}).then((result) => {
				resp.json(result);
			});
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});

router.post('/update', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.update(
			{
				name: req.body.name,
				fleetId: req.body.fleetId
			},
			{
				where: {
					id: req.body.id,
					deletedAt: null
				}
			}
		).then((result) => {
			if (!result)
			{
				console.log("400");
				res.statusCode = 400;
				res.json({error: "400 - bad request"});
			}
			else
			{
				db.Vehicle.findById(req.body.id).then((vehicle) => {
					res.json(vehicle);
				});
			}
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});

router.post('/delete', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.findById(req.body.id).then((result) => {
			console.log(result);
			if (result === null || result.deletedAt !== null)
			{
				console.log("400");
				res.statusCode = 400;
				res.json({error: "400 - bad request"});
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
		resp.json({ 'error': err });
	}
});

router.get('/milage/:id', (req, resp) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.findById(req.params.id).then((result) => {
			if (result === null || result.deletedAt !== null)
			{
				console.log("400");
				resp.statusCode = 400;
				resp.json({error: "400 - bad request"});
			}
			else {
				let coords = [];
				let coordstime = [];
				db.Motion.findAll({
					where: {
						vehicleId: req.params.id
					}
				}).then((result) => {
					result.forEach((motion) => {
						coords.push(motion.latLng);
						coordstime.push(motion.latLngTime);
					});

					let len = 0;
					let spd = 0;
					if (coords.length < 2)
					{
						resp.json(len);
					}
					for (var i = 0; i < coords.length - 1; i++) {
						len += geolib.getDistanceSimple(coords[i], coords[i+1]);
						console.log(geolib.getDistanceSimple(coords[i], coords[i+1]));
						spd += geolib.getSpeed(coordstime[i], coordstime[i+1]);
						console.log(geolib.getSpeed(coordstime[i], coordstime[i+1]));
					}

					resp.json({
						'getDistance': len,
						'getAvgSpeed': Math.round(spd / (coordstime.length - 1))
					});
				});
			}
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});


module.exports = router;