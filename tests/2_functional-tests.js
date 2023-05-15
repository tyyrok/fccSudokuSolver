const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

import {puzzlesAndSolutions} from '../controllers/puzzle-strings.js';
import {stringWithInvalidChar} from '../tests/1_unit-tests.js';
import {defaultPuzzle} from '../tests/1_unit-tests.js';

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  test('#1 Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[2][0] })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { solution: puzzlesAndSolutions[2][1] });
          done();
        })
    
  });

  test('#2 Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/solve')
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Required field missing' });
          done();
        })
    
  });

  test('#3 Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: stringWithInvalidChar })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Invalid characters in puzzle' });
          done();
        })
  });

  test('#4 Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.9..5.....9..9....8.2.3674.3.7.2..9947' })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        })
  });

  test('#5 Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: '568913724342687519197254386685479231219538467734162895926345178473891652851724..3' })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Puzzle cannot be solved' });
          done();
        })
  });

  test('#6 Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: defaultPuzzle,
                coordinate: 'B5',
                value: 3, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { valid: true });
          done();
        })
  });

  test('#7 Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: defaultPuzzle,
                coordinate: 'D3',
                value: 8, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { valid: false });
          assert.property(res.body, 'conflict');
          done();
        })
  });

  test('#8 Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: defaultPuzzle,
                coordinate: 'E5',
                value: 6, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { valid: false });
          assert.isAtLeast(res.body.conflict.length, 2);
          done();
        })
  });

  test('#9 Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: defaultPuzzle,
                coordinate: 'B6',
                value: 5, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { valid: false });
          assert.equal(res.body.conflict.length, 3);
          done();
        })
  });

  test('#10 Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: defaultPuzzle,
                value: 2, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Required field(s) missing' });
          done();
        })
  });

  test('#11 Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: stringWithInvalidChar,
                coordinate: 'B3',
                value: 2, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Invalid characters in puzzle' });
          done();
        })
  });

  test('#12 Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.9..5.....9..9....8.2.3674.3.7.2..9947',
                coordinate: 'B3',
                value: 2, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        })
  });

  test('#13 Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: defaultPuzzle,
                coordinate: 'Bc2',
                value: 2, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Invalid coordinate' });
          done();
        })
  });

  test('#14 Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: defaultPuzzle,
                coordinate: 'B3',
                value: 20, 
              })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.include(res.body, { error: 'Invalid value' });
          done();
        })
  });
  
  
});

