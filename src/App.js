import { useEffect, useState } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false },
]
let turnHistory = [];

function App() {

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [match, setMatch] = useState(0);
  

  const startNewGame = () => {
    if(match === 6) {
      turnHistory.push(turns + " turns (W)")
      setMatch(0);
      shuffleCards();
      return;
    }
    turnHistory.push(turns + " turns (L)")
    setMatch(0);
    shuffleCards();
    console.log(turnHistory);
  }

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  }

  // hanlde a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }
  
  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if(choiceOne.src === choiceTwo.src) {
        let matches = match + 1;
        setMatch(matches)
        choiceOne.matched = true;
        choiceTwo.matched = true;
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src) {
              return { ...card, matched: true }
            }
            return card;
          })
        })
        resetTurn();
        return;
      }
      setTimeout(() => {
        resetTurn();
      }, 600);
    }
  }, [choiceOne, choiceTwo, match])

  // reset choices and increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  }

  // start a new game on startup
  useEffect(() => {
    shuffleCards();
  }, [])

  return (
    <div className="App">
      <div className="History">
        <h4>Game History:</h4>
        <ol>
          { turnHistory.map(turn => {
              return<li>{turn}</li>
            })
          }
        </ol>
      </div>
      <div className="Game">
        <h1>Memory Flipper</h1>
        <button className="newGameBtn" onClick={startNewGame}>New Game</button>
        <div className='card-grid'>
          {cards.map(card=>(
            <SingleCard 
              key={card.id}
              card={card} 
              handleChoice={handleChoice} 
              flipped={ card === choiceOne || card === choiceTwo || card.matched }
              disabled={ disabled }
            />
          ))}
        </div>
        <p>{turns} Turns</p>
      </div>
    </div>
  );
}

export default App;
