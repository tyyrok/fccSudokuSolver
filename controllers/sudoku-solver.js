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

    for (let key in this.grid){
      if (key == row.toLowerCase()) {
        console.log("Row For Check - " + puzzleString.slice(this.grid[key], this.grid[key] + 9));
        console.log("Value - " + value);
        if (puzzleString.slice(this.grid[key], this.grid[key] + 9).includes(value)) {
          return false;
        }
        break;
      }
    }
    console.log("Row ok!")
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    
    let rowForCheck = '';

    for (let i = 0; i < 9; i++) {
        rowForCheck += puzzleString[ (column - 1) + (i * 9) ];
    }
    
    console.log("Col For Check - " + rowForCheck);
    if (rowForCheck.includes(value)){
      return false;
    }
    console.log("Col ok!");
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    
    let regionForCheck = '';
    let startPointRegion = this.grid[row];
    console.log(this.grid[row]);
    console.log("Start Point for region " + startPointRegion);
    
    switch (startPointRegion % 27 ) {
      case 9:
        startPointRegion -= 9; 
        break;
      case 18:
        startPointRegion -= 18;
        break;
    }
    if (column % 9 == 0) column -= 3;
    startPointRegion += (column - ( column % 3) ); 
    console.log("StartPoint Region - " + startPointRegion);

    for (let i = 0; i < 3; i++) {
      for (let j = 0 ; j < 3; j++) {
        regionForCheck += puzzleString[startPointRegion + j];
      }
      startPointRegion += 9;
    }
    
    console.log("Region For Check - " + regionForCheck);
    if (regionForCheck.includes(value)){
      return false;
    }
    console.log("Region ok!")
    return true;
    
  }

  solve(puzzleString) {
    
    let switcher = false;
    
    while (puzzleString.includes('.')){
      
      let indexOfDot = puzzleString.indexOf('.');
      switcher = false;
      for (let j = 1; j <= 9; j ++){

        let row = this.additionalGrid[(indexOfDot - (indexOfDot % 9))/9];
        let value = j;
        
        let column = (indexOfDot % 9 == 0)? 1 : (indexOfDot % 9) + 1;

        console.log("--------------");
        console.log("Column - " + column);
        console.log("Row - " + row);
        console.log("Value - " + value);
        
        if (this.checkRowPlacement(puzzleString, row, column, value)){
          if (this.checkColPlacement(puzzleString, row, column, value)){
            if (this.checkRegionPlacement(puzzleString, row, column, value)){
              let newPuzzleString = puzzleString.replace('.', value);
              
              console.log("New puzzle string - " + newPuzzleString);
              
              puzzleString = newPuzzleString.slice();
              console.log("New string - " + puzzleString);
              switcher = true;
            } 
          }
        }
        if (switcher) break;
      }
      if (!switcher) {
        console.log("Houston we have a problem!");
        break;
      } 
    }
    
    console.log("Final Puzzle String - " + puzzleString);
    
    return puzzleString;
  } 
}

module.exports = SudokuSolver;

