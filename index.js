const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const CHAVE = 'ultimato:ehfodabagarai';

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
		resp.status(403).send({ auth: false, message: 'Error in username or password' });
	}
});

app.listen(3000, () => console.log('Server started at port 3000'));
