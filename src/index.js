import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const { highlight, onClick, value } = props;
  if (highlight) {
    return (
      <button className="square" onClick={onClick} style={{ color: '#0f0' }}>
        {value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={onClick}>
        {value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    const { squares, highlights, onClick } = this.props;
    return (
      <Square key={i} value={squares[i]} highlight={highlights[i]}
        onClick={() => onClick(i)}
      />
    );
  }

  render() {
    const rows = [];
    for (let r = 0; r < 3; r++) {
      const row = [];
      for (let c = r * 3; c < r * 3 + 3; c++) {
        row.push(this.renderSquare(c));
      }
      rows.push(<div className="board-row" key={r}>{row}</div>);
    }
    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        desc: 'Game start'
      }],
      stepNumber: 0,
      xIsNext: true,
      sort: false
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const positions = [
      '(1, 1)', '(2, 1)', '(3, 1)',
      '(1, 2)', '(2, 2)', '(3, 2)',
      '(1, 3)', '(2, 3)', '(3, 3)'
    ];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const desc = `Move to ${positions[i]}`;
    this.setState({
      history: history.concat([{ squares, desc }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      sort: false
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      sort: false
    });
  }

  render() {
    const history = this.state.sort ?
      this.state.history.reverse() :
      this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const highlights = Array(9).fill(false);

    const moves = history.map((step, move) => {
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ?
              <strong>{step.desc}</strong> :
              step.desc
            }
          </button>
        </li>
      )
    });

    let status = '';
    if (winner) {
      status = `Winner: ${winner.winner}`;
      const [a, b, c] = winner.line;
      highlights[a] = true;
      highlights[b] = true;
      highlights[c] = true;
    } else {
      if (this.state.stepNumber === 7) {
        status = 'A draw';
      } else {
        status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
            highlights={highlights}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.setState({
              stepNumber: history.length - 1 - this.state.stepNumber,
              sort: true
            })}>
              sort
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
