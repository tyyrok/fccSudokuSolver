class SudokuSolver {
  constructor(){
    this.grid = { a: 0, b: 9, c: 18, d: 27, e: 36, f: 45, g: 54, h: 63, i: 72 };
    this.additionalGrid = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  }
  
  validate(puzzleString) {
    
    //{ error: 'Expected puzzle to be 81 characters long' }
    if (puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    } else {
      //{ error: 'Invalid characters in puzzle' }
      if (!puzzleString.match(/^[1-9.]+$/g)){
        return { error: 'Invalid characters in puzzle' };
      } else {
        return { result: 'correct' }
      }
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {

    if (puzzleString.at( (this.grid[row.toLowerCase()] + Number(column) - 1) ) == value) return true;

    for (let key in this.grid){
      if (key == row.toLowerCase()) {

        if (puzzleString.slice(this.grid[key], this.grid[key] + 9).includes(value)) {
          return false;
        }
        break;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    
    let rowForCheck = '';
    
    if (puzzleString[this.grid[row.toLowerCase()] + Number(column) - 1] == value) return true;

    for (let i = 0; i < 9; i++) {
        rowForCheck += puzzleString[ (column - 1) + (i * 9) ];
    }
    

    if (rowForCheck.includes(value)){
      return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    
    let regionForCheck = '';
    let startPointRegion = this.grid[row.toLowerCase()];
    
    if (puzzleString[this.grid[row.toLowerCase()] + Number(column) - 1] == value) return true;
    
    switch ((startPointRegion - (startPointRegion % 27)) / 27 ) {
      case 0:
        startPointRegion = 0;
        break;
      case 1:
        startPointRegion = 27; 
        break;
      case 2:
        startPointRegion = 54;
        break;
    }
    switch (((column - 1) - ((column - 1) % 3) ) / 3 ) {
      case 0:
        break;
      case 1:
        startPointRegion += 3;
        break;
      case 2:
        startPointRegion += 6;
        break;
    }

    
    for (let i = 0; i < 3; i++) {
      for (let j = 0 ; j < 3; j++) {
        regionForCheck += puzzleString[startPointRegion + j];
      }
      startPointRegion += 9;
    }
    
    if (regionForCheck.includes(value)){
      return false;
    }
    return true;
    
  }

  solve(puzzleString) {

    if (this.validate(puzzleString).hasOwnProperty('error') ) return false;
    
    let switcher = false;
    
    while (puzzleString.includes('.')){
      
      let indexOfDot = puzzleString.indexOf('.');
      switcher = false;
      for (let j = 1; j <= 9; j ++){

        let row = this.additionalGrid[(indexOfDot - (indexOfDot % 9))/9];
        let value = j;
        
        let column = (indexOfDot % 9 == 0)? 1 : (indexOfDot % 9) + 1;
        
        if (this.checkRowPlacement(puzzleString, row, column, value)){
          if (this.checkColPlacement(puzzleString, row, column, value)){
            if (this.checkRegionPlacement(puzzleString, row, column, value)){

              let newPuzzleString = puzzleString.replace('.', value);
              let recursion = this.solve(newPuzzleString);
              
              if (recursion) {

                puzzleString = newPuzzleString.slice();

                switcher = true;
                if (!recursion.includes('.')) return recursion;
              }
            } 
          }
        }
        if (switcher) break;
        
      }
      if (!switcher) {
        //console.log("Houston we have a problem!");
        return false;
      } 
    }
    
    //console.log("Final Puzzle String - " + puzzleString);
    
    return puzzleString;
  } 
}

module.exports = SudokuSolver;

