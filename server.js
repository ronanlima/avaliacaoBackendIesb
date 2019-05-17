const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const CHAVE = 'ultimato:ehfodabagarai';
const SEGREDO = 'euvoupracasa';
var tasks = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function requestTokenJwt(req, resp, next) {
	if (req.url == '/login' || req.url == '/') {
		next();
	}

	var token = req.headers['x-access-token'];
	try {
		var decodificado = jwt.verify(token, CHAVE);
		next();
	} catch (e) {
		resp.status(500).send({ message: 'token inválido'});
	}
}
app.use(requestTokenJwt);

app.get('/', (req, res) => res.send({message: 'ok'}));

app.post('/login', (req, resp) => {
	var body = req.body; 
	if (body.username == 'usuario' && body.password == '123456') {
		var token = jwt.sign({ username: 'usuario', role: 'admin'}, CHAVE, {
			expiresIn: '1h'
		});
		resp.send({ auth: true, token });
	} else {
		resp.status(401).send({ auth: false, message: 'Error in username or password' });
	}
});

app.post('/tasks', (request, response) => {
	const body = request.body;
	const task = {
		id: uuid(),
		title: body.title,
		description: body.description,
		isDone: body.isDone,
		isPriority: body.isPriority
	};
	tasks.push(task);
	response.status(201);
	response.send(task);
});

app.get('/tasks', (request, response) => {
	response.status(200).send(tasks);
});

app.get('/tasks/:taskId', (request, response) => {
	const task = tasks.find(t => t.id == request.params.taskId);
	if (task) {
		response.status(200);
		response.send(task);
	} else {
		response.status(404);
		response.send();
	}
});

app.put('/tasks/:taskId', (request, response) => {
	const { body } = request;
	const task = tasks.find(t => t.id == request.params.taskId);
	if (task) {
		task.title = body.title;
		task.description = body.description;
		task.isDone = body.isDone;
		task.isPriority = body.isPriority;
		response.status(200).send(task);
	} else {
	response.status(404);
	response.send();
	}
});

app.delete('/tasks/:taskId', (request, response) => {
	var task = tasks.find(t => t.id == request.params.taskId);
	if (task) {
		tasks = tasks.filter(t => t.id != request.params.taskId);
		response.status(200).send(task)
	} else {
		response.status(404).send()
	}
});

app.post('/login', (req, resp) => {
	var body = req.body;
	if (body.username == 'usuario' && body.password == 'teste123') {
		var token = jwt.sign({ username: 'usuario', role: 'admin' }, SEGREDO, {
			expiresIn: '1h'
		});
		resp.send({ auth: true, token });
	} else {
		resp.status(403).send({ auth: false, message: 'usuario invalido' });
	}
})
app.listen(3000);