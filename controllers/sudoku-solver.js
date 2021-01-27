const N = 9;

class SudokuSolver {
  validate(puzzleString) {}

  letterToNumber(row){
    if(row.toUpperCase()==="A")return 1;
    else if(row.toUpperCase()==="B")return 2;
    else if(row.toUpperCase()==="C")return 3;
    else if(row.toUpperCase()==="D")return 4;
    else if(row.toUpperCase()==="E")return 5;
    else if(row.toUpperCase()==="F")return 6;
    else if(row.toUpperCase()==="G")return 7;
    else if(row.toUpperCase()==="H")return 8;
    else if(row.toUpperCase()==="I")return 9;
    else return "none";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid=this.transform(puzzleString);
    row=this.letterToNumber(row);
    if(grid[row-1][column-1]!==0) return false;
    for(let i=0;i<N;i++) if(grid[row-1][i]==value) return false;
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid=this.transform(puzzleString);
    row=this.letterToNumber(row);
    if(grid[row-1][column-1]!==0) return false;
    for(let i=0;i<N;i++) if(grid[i][column-1]==value) return false;
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid=this.transform(puzzleString);
    row=this.letterToNumber(row);
    if(grid[row-1][column-1]!==0) return false;
    let startRow=row-(row%3),startCol=column-(column%3);
    for(let i=0;i<3;i++)
      for(let j=0;j<3;j++)
        if(grid[i+startRow][j+startCol]==value) return false;
    return true;
  }

  isSafe(board, row, col, num) {
    for (let d = 0; d < board.length; d++) {
      if (board[row][d] == num) {
        return false;
      }
    }

    for (let r = 0; r < board.length; r++) {
      if (board[r][col] == num) {
        return false;
      }
    }

    let sqrt = Math.sqrt(board.length);
    let boxRowStart = row - (row % sqrt);
    let boxColStart = col - (col % sqrt);

    for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
      for (let d = boxColStart; d < boxColStart + sqrt; d++) {
        if (board[r][d] == num) {
          return false;
        }
      }
    }

    return board;
  }

  solveSudoku(board, n) {
    let row = -1;
    let col = -1;
    let isEmpty = true;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] == 0) {
          row = i;
          col = j;
          isEmpty = false;
          break;
        }
      }
      if (!isEmpty) {
        break;
      }
    }

    if (isEmpty) {
      return board;
    }

    for (let num = 1; num <= n; num++) {
      if (this.isSafe(board, row, col, num)) {
        board[row][col] = num;
        if (this.solveSudoku(board, n)) {
          return board;
        } else {
          board[row][col] = 0;
        }
      }
    }
    return false;
  }

  transform(puzzleString) {
    let grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      row = -1,
      col = 0;
    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 == 0) row++;
      if (col % 9 == 0) col = 0;
      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      col++;
    }
    return grid;
  }

  transformBack(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    if(puzzleString.length!=81) return false;
    if(/[^0-9.]/g.test(puzzleString)) return false;
    let grid = this.transform(puzzleString);
    let solved = this.solveSudoku(grid, N);
    if (!solved) return false;
    let solvedString = this.transformBack(solved);
    return solvedString;
  }
}
//769235418851496372432178956174569283395842761628713549283657194516924837947381625
module.exports = SudokuSolver;
