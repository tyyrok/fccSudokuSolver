const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

import {puzzlesAndSolutions} from '../controllers/puzzle-strings.js';
const stringWithInvalidChar = '1.5..2.84..63.12.7.|..5.....9..1....8.2.3674.3.7.2..9D47...8..1..16....926914.37.';
const stringMoreThan81 = '1.5..2.84..63.12.7.9..5.....9..9....8.2.3674.3.7.2..9947...8..9..16....9269314.37.';
const defaultPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";


suite('Unit Tests', () => {
  
  test('#1 Logic handles a valid puzzle string of 81 characters', (done) => {
    for (let prop of puzzlesAndSolutions){
      assert.property(solver.validate(prop[0]), 'result');
    }
    done();
  });

  test('#2 Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    assert.include(solver.validate(stringWithInvalidChar), { error: 'Invalid characters in puzzle' });
    done();
  });

  test('#3 Logic handles a puzzle string that is not 81 characters in length', (done) => {
    assert.include(solver.validate(stringMoreThan81), { error: 'Expected puzzle to be 81 characters long' });
    done();
  });

  test('#4 Logic handles a valid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(defaultPuzzle, 'A', 1, 7), true);
    done();
  });

  test('#5 Logic handles an invalid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(defaultPuzzle, 'A', 1, 9), false);
    done();
  });

  test('#6 Logic handles a valid column placement', (done) => {
    assert.equal(solver.checkColPlacement(defaultPuzzle, 'A', 7, 3), true);
    done();
  });

  test('#7 Logic handles an invalid column placement', (done) => {
    assert.equal(solver.checkColPlacement(defaultPuzzle, 'A', 7, 6), false);
    done();
  });

  test('#8.1 Logic handles a valid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(defaultPuzzle, 'b', 3, 1), true);
    done();
  });

  test('#9 Logic handles an invalid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(defaultPuzzle, 'h', 7, 4), false);
    done();
  });
  

  test('#10 Valid puzzle strings pass the solver', (done) => {
    assert.equal(solver.solve(puzzlesAndSolutions[3][0]), puzzlesAndSolutions[3][1]);
    done();
  });
});
