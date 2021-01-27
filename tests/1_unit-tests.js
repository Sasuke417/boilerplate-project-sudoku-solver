const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzle="..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
complete="769235418851496372432178956174569283395842761628713549283657194516924837947381625";

suite('UnitTests', () => {
    suite("solver tests",()=>{
        test("Logic handles a valid puzzle string of 81 characters",(done)=>{
            assert.equal(solver.solve(validPuzzle),complete);
            done();
        });
        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)",(done)=>{
            let invalidPuzzle="..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.g";
            assert.equal(solver.solve(invalidPuzzle),false);
            done();
        });
        test("Logic handles a puzzle string that is not 81 characters in length",(done)=>{
            let invalidPuzzle=".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            assert.equal(solver.solve(invalidPuzzle),false);
            done();
        });
        test("Logic handles a valid row placement",(done)=>{
            assert.equal(solver.checkRowPlacement(validPuzzle,"A","1","7"),true);
            done();
        });
        test("Logic handles an invalid row placement",(done)=>{
            assert.equal(solver.checkRowPlacement(validPuzzle,"A","1","5"),false);
            done();
        });
        test("Logic handles a valid column placement",(done)=>{
            assert.equal(solver.checkColPlacement(validPuzzle,"A","1","7"),true);
            done();
        });
        test("Logic handles an invalid column placement",(done)=>{
            assert.equal(solver.checkColPlacement(validPuzzle,"A","1","6"),false);
            done();
        });
        test("Logic handles a valid region (3x3 grid) placement",(done)=>{
            assert.equal(solver.checkRegionPlacement(validPuzzle,"A","1","7"),true);
            done();
        });
        test("Logic handles an invalid region (3x3 grid) placement",(done)=>{
            assert.equal(solver.checkRegionPlacement(validPuzzle,"A","5","4"),false);
            done();
        });
        test("Valid puzzle strings pass the solver",(done)=>{
            assert.equal(solver.solve(validPuzzle),complete);
            done();
        });
        test("Invalid puzzle strings fail the solver",(done)=>{
            let invalidPuzzle="1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            assert.equal(solver.solve(invalidPuzzle),false);
            done();
        });
        test("Solver returns the the expected solution for an incomplete puzzzle",(done)=>{
            assert.equal(solver.solve(validPuzzle),complete);
            done();
        });
    });
});
