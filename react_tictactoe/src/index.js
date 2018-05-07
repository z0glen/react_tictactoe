import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const fontweight = props.winner ?
    {fontWeight: 'bold'} : {fontWeight: 'normal'};
  return (
    <button
        style={fontweight}
        className="square"
        onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = this.props.winner ?
      this.props.winner.squares.includes(i) : false;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={winner}
      />
    );
  }

  createBoard = () => {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(i*3+j));
      }
      board.push(<div className="board-row" key={i}>{row}</div>);
    }
    return board;
  };

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sorted: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reSort(list) {
    this.setState({
      moves: sortList(list),
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const sorted = this.state.sorted;
    console.log(this.state);

    let moves = history.map((step, move) => {
      let diff = '';
      let row = 0;
      let col = 0;
      if (move) {
        const curr = history[move].squares;
        const prev = history[move-1].squares;
        diff = checkDiff(curr, prev);
        row = Math.floor(diff/3);
        col = diff % 3;
      }
      const desc = move ?
        'Go to move #' + move + ', ' + (this.state.xIsNext ? 'O' : 'X') +
          ' to (' + row + ', ' + col + ')' :
        'Go to game start';
      const fontweight = move === this.state.stepNumber ?
        {fontWeight: 'bold'} : {fontWeight: 'normal'};
      return (
        <li key={move}>
          <button
            style={fontweight}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else if (history.length > 9) {
      status = 'It\'s a draw!'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let sort = <button onClick={() => this.reSort(moves)}>'Sort'</button>;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{sort}</div>
          <ol>{this.state.moves}</ol>
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
      return ({
        winner: squares[a],
        squares: lines[i],
      });
    }
  }
  return null;
}

function checkDiff(list1, list2) {
  for (let i = 0; i < list1.length; i++) {
    if (list1[i] !== list2[i]) {
      return i;
    }
  }
  return null;
}

function sortList(list) {
  console.log(list);
  let out = [];
  for (let i = 0; i < list.length; i++) {
    let curr = null;
    for (let j = 0; j < list.length; j++) {
      if (list[i].key > list[j].key) {
        curr = list[j]
      }
    }
    curr = curr ? curr : list[i];
    out[out.length] = curr;
  }
  console.log(out);
  return out;
}

function sortListReverse(list) {
  console.log(list);
  let out = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (list[i] < list[j]) {
        out.append(list[j]);
      }
    }
  }
  console.log(out);
  return out;
}
