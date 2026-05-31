import { Card } from "./components/Card"
import { GameHeader } from "./components/GameHeader"
import { useGameLogic } from "./hooks/useGameLogics"
import { VictoryMessage } from "./components/WinMessage"


const cardValue = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
]

function App() {
  const { cards, score, moves, handleCardClick, initializeGame, isGameComplete } = useGameLogic(cardValue);

  return (
    <div className="app">
      <GameHeader score={score} moves={moves} onReset={initializeGame} />
      {isGameComplete && <VictoryMessage moves={moves} />}
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  )
}

export default App
