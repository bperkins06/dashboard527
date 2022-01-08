import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const cell = "cell_"+i;
    return (
      <Square
        key={cell}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  /*
  render() {
    let row_key, cells, rows=[];
    const ROWS = 3;
    const COLS = 3;

    // ---------------------------------------------------------------
    // Dynamic way that uses JSX
    // ---------------------------------------------------------------
    for (let i=0;i<ROWS;i++){
      cells = [];
      row_key = 'row_'+i;
      for (let j=0;j<COLS;j++){
        cells.push(this.renderSquare((i*COLS)+j));
      }
      rows.push(<div key={row_key} className="board-row">{cells}</div>);
    }

    return (<div>{rows}</div>);
  }
  */

  render() {
    let container, cells, rows=[], row_key;
    const ROWS = 3;
    const COLS = 3;

    // ---------------------------------------------------------------
    // Dynamic way that uses React.createElement
    // ---------------------------------------------------------------
    for (let i=0;i<ROWS;i++){
      cells = [];
      row_key = 'row_'+i;
      for (let j=0;j<COLS;j++){
        cells.push(this.renderSquare((i*COLS)+j));
      }
      rows.push(React.createElement("div", { key:row_key, className: "board-row" }, cells));
    }

    container = React.createElement("div", null, rows);
    return container;
  }

  // ----------------------------------------------------
  // Hardcoded way 
  // ----------------------------------------------------
  /*
  return (
    <div>
      <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>
  );*/
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: 0
      }],
      stepNumber: 0,
      xIsNext: true,
      orderAscending: true,
    };
  }  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = calculateLocation(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      orderAscending: this.state.orderAscending,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  sortMoves() {
    console.log('Sort the moves');
    this.setState({
      orderAscending: !this.state.orderAscending,      
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const order = this.state.orderAscending ? history : history.reverse();
    const sortButton = this.state.orderAscending ? "Sort Descending":"Sort Ascending"
    const moves = order.map((step, move) => {
      const location = move ? ' Location: ('+order[move].location+')':'';
      const desc = move ?
        'Go to move #' + move:
        'Go to game start';
      return (
        <li key={move}> 
          <button onClick={() => this.jumpTo(move)}>{desc}</button>{location}
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.sortMoves()}>{sortButton}</button></div> 
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateLocation(index) {
  const x = Math.floor(index/3);
  const y = index%3;
  return x+','+y;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
