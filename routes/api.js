'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      
      if (!req.body.hasOwnProperty('puzzle') || !req.body.hasOwnProperty('coordinate') || !req.body.hasOwnProperty('value')) {
        
        res.json({ error: 'Required field(s) missing' });
      } else {
          let puzzle = req.body.puzzle;
          let coordinate = req.body.coordinate;
          let row = coordinate[0];
          let column = coordinate[1];
          let value = req.body.value;
          let resultOfValidation = solver.validate(puzzle);
        
          if (resultOfValidation.hasOwnProperty('error')) {
              res.json(resultOfValidation);
          } else {
            if (! (/^[1-9]$/.test(value)) ) {
              res.json({ error: 'Invalid value' });
              
            } else {

              if (coordinate.length != 2 || !row.match(/^[a-iA-I]/) || !column.match(/[1-9]$/) ){
                res.json({ error: 'Invalid coordinate' });
                
              } else {
                
                let conflict = [];
                let result = {};
                
                if ( !solver.checkRowPlacement(puzzle, row, column, value) ) {
                  conflict.push('row');
                }
                  
                if ( !solver.checkColPlacement(puzzle, row, column, value) ) {
                  conflict.push('column');
                }
                    
                if ( !solver.checkRegionPlacement(puzzle, row, column, value) ) {
                  conflict.push('region');
                }

                if (conflict.length > 0) {
                  result.valid = false;
                  result.conflict = conflict;
                } else {
                  result.valid = true;
                }

                console.log(result);
                res.json(result);
              }
            }
          }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {

      if (!req.body.hasOwnProperty('puzzle')) {
        res.json({ error: 'Required field missing' });
      }
      
      if (solver.validate(req.body.puzzle).hasOwnProperty('error') ){
        res.json(solver.validate(req.body.puzzle));  
      } else {
        let result = solver.solve(req.body.puzzle);

        if (!result) {
          res.json({ error: 'Puzzle cannot be solved' });
        } else {
          res.json({ solution: result });
        }
      }
      
    });
};
