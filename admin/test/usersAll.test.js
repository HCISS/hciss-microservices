const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const genUsername =require ("unique-username-generator");
  
chai.use(chaiHttp);

let token, user_id;

const usernameGenerated = genUsername.generateUsername("", 3);
 
describe('/POST /auth', () => {
	before('LOGIN & ACCESSTOKEN', (done) => {
		chai.request(server)
			.post('/auth')
			.send({username: 'testuser', password: 'test'})
			.end((err, res) => {
				if (err)
					throw err;

				token = res.body.access_token;
				console.log(res.body)
				done();
			});
	});

	describe('/GET /api/user', () => {
		it('USER PROFILE', (done) => {
			chai.request(server)
				.get('/api/user/')
				.set('x-access-token', token)
				.end((err, res) => {
					if (err)
						throw err;

					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				});
		});
	});

	describe('/POST /register', () => {
		it('REGISTRATION', (done) => {
			const user = {
				username: usernameGenerated, //unique name
				password: 'dereli',
			};
			chai.request(server).post('/register')
				.send(user)
				.set('x-access-token', token)
				.end((err, res) => {
					if (err)
						throw err;
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(true);
					user_id = res.body.data._id;
					done();
				});
		});
	});

	describe('/PUT /user/update/:user_id', () => {
		it('UPDATE PROFILE UPDATE', (done) => {
			const user = {
				username: 'Kuzey Deniz',
			};
			chai.request(server)
				.put('/api/user/update/' + user_id)
				.send(user)
				.set('x-access-token', token)
				.end((err, res) => {
					if (err)
						throw err;
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(true);
					done();
				});
		});
	});

	describe('/PUT /user/update/:user_id', () => {
		it('UPDATE PROFILE ERROR MESSAGE', (done) => {
			const user = {
				username: 'Kuzey Deniz',
			};
			chai.request(server)
				.put('/api/user/update/' + user_id+11)
				.send(user)
				.set('x-access-token', token)
				.end((err, res) => {
					if (err)
						throw err;
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(false);
					done();
				});
		});
	});
});



