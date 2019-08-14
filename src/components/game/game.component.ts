import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit {
  direction = '';
  numbers = Array.apply(null, {length: 16}).map(Number.call, Number);
  optimal = Array.apply(null, {length: 16}).map(Number.call, Number).splice(0, 1).push(0);
  grid = [];
  adjacents = [];
  emptyInArray = 0;
  emptyInGrid = {row: 0, col: 0};
  prevEmpty = {row: 0, col: 0};
  success = false;
  rowLength = 4;

  ngOnInit() {
    this.shuffle(this.numbers);
    this.setGrid();
  }

  shuffle(array) {
    let len = array.length;
    let temp;
    let index;

    while (len) {

      index = Math.floor(Math.random() * len--);
      temp = array[len];
      array[len] = array[index];
      array[index] = temp;
    }
    console.log('calc 0 in array', array, array.indexOf(0));
    this.emptyInArray = array.indexOf(0);
    return array;
  }

  setGrid(chosen?: number) {
    this.grid = [];
    this.adjacents = [];
    const shuffled = Array.from(this.numbers);
    while (shuffled.length > 0) {
      this.grid.push(shuffled.splice(0, this.rowLength));
    }
    this.emptyInGrid = this.getEmptyTile();
    // for animation
    // if (chosen) {
    //  this.moveTile(chosen);
    // }

    this.adjacents = this.getAdjacentTiles( this.emptyInGrid );
  }

  resetGrid(chosen: number) {
    const chosenIndex = this.numbers.indexOf(chosen);
    this.numbers[this.emptyInArray] = chosen;
    this.numbers[chosenIndex] = 0;
    this.emptyInArray = chosenIndex;

    this.setGrid(chosen);

    this.checkResults();
  }

  getEmptyTile(): any {
    this.prevEmpty = this.emptyInGrid;
    const col = this.emptyInArray % 4;
    const row = this.emptyInArray >= 4 ? Math.floor(this.emptyInArray / 4) : 0;
    return { row, col };
  }

  moveTile(chosen: number) {
    this.direction = '';

    if (this.prevEmpty.row !== this.emptyInGrid.row ) {
      if (this.prevEmpty.row > this.emptyInGrid.row) {
        this.direction = 'down';
      } else if ( this.prevEmpty.row < this.emptyInGrid.row) {
        this.direction = 'up';
      }
    } else if (this.prevEmpty.col !== this.emptyInGrid.col) {
      if (this.prevEmpty.col > this.emptyInGrid.col) {
        this.direction = 'right';
      } else if (this.prevEmpty.col < this.emptyInGrid.col) {
        this.direction = 'left';
      }
    }
    const tile = document.getElementById(chosen.toString());
    tile.classList.add(this.direction);
    setTimeout(() => {
      tile.classList.value = 'adjacent';
    }, 2000);
  }

  getAdjacentTiles({ row, col }): any[] {
    let a = [];
    switch (col) {
      case 0:
        a.push(this.grid[row][col + 1]);
        break;
      case 3:
        a.push(this.grid[row][col - 1]);
        break;
      default:
        a.push(...[this.grid[row][col - 1], this.grid[row][col + 1]]);
        break;
    }

    switch (row) {
      case 0:
        a.push(this.grid[row + 1][col]);
        break;
      case 3:
        a.push(this.grid[row - 1][col]);
        break;
      default:
        a.push(...[this.grid[row - 1][col], this.grid[row + 1][col]]);
        break;
    }
    this.emptyInGrid = { row, col };
    return a;
  }

  checkResults() {
    const results = Array.from(this.numbers);
    this.success = JSON.stringify(results) === JSON.stringify(this.optimal);
  }
}
