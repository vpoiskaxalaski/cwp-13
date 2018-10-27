module.exports.valid = function(req) {
	req.url = req.originalUrl;
	let errorMsg = "";
	console.log(req.method);
	console.log(req.url);
	switch(req.method) {
		case 'GET':
		{
			console.log(req.params);
			console.log(req.url.split("/")[3]);
			switch (req.url.split("/")[3])
			{
				case 'read':
				{
					console.log((req.params.id));
					if (!(parseInt(req.params.id, 10) > 0))
					{
						errorMsg += "error: id argument is not valid; ";
					}
					break;
				}
				case 'readall':
				{
					switch (req.url.split("/")[2]) {
						case "vehicles":
						{
							if (!(parseInt(req.params.fleetId, 10) > 0))
							{
								errorMsg += "error: fleetId argument is not valid; ";
							}
							break;
						}
					}
					break;
				}
				case 'milage':
				{
					console.log((req.params.id));
					if (!(parseInt(req.params.id, 10) > 0))
					{
						errorMsg += "error: id argument is not valid; ";
					}
					break;
				}
			}
			break;
		}
		case 'POST':
		{
			console.log(req.body);
			switch (req.url.split("/")[3]) {
				case 'create':
				{
					switch(req.url.split("/")[2])
					{
						case "fleets":
						{
							if (!req.body.name)
							{
								errorMsg += "error: name is not found; ";
							}
							break;
						}
						case "motions":
						{
							if (!req.body.latitude)
							{
								errorMsg += 'error: latitude is not found; ';
							}
							if (!req.body.longitude)
							{
								errorMsg += "error: longitude is not found; ";
							}
							if (!req.body.time)
							{
								errorMsg += "error: time is not found; ";
							}
							if (!(parseInt(req.body.vehicleId, 10) > 0))
							{
								errorMsg += "error: vehicleId argument is not valid; ";
							}
							break;
						}
						case "vehicles":
						{
							if (!req.body.name)
							{
								errorMsg += "error: name is not found; ";
							}
							if (!(parseInt(req.body.fleetId, 10) > 0))
							{
								errorMsg += "error: fleetId argument is not valid; ";
							}
							break;
						}
					}
					break;
				}
				case 'delete':
				{
					if (!(parseInt(req.body.id, 10) > 0))
					{
						errorMsg += "error: id argument is not valid; ";
					}
					break;
				}
				case 'update':
				{
					if (!(parseInt(req.body.id, 10) > 0))
					{
						errorMsg += "error: id argument is not valid; ";
					}
					break;
				}
			}
			break;
		}
	}
	if (errorMsg === "")
	{
		console.log("all is good");
	}
	return errorMsg;
};