import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted || isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, gameOver]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        directionRef.current = nextDirectionRef.current;
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [hasStarted, isPaused, gameOver, food, generateFood, highScore]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center mb-4 px-2 border-b-4 border-glitch-cyan pb-2">
        <div className="text-glitch-cyan text-3xl">
          DATA: {score}
        </div>
        <div className="text-glitch-magenta text-3xl">
          PEAK: {highScore}
        </div>
      </div>

      <div 
        className="relative w-full aspect-square bg-void border-4 border-glitch-magenta overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }}
        />

        <div
          className="bg-glitch-magenta"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-white' : 'bg-glitch-cyan'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          );
        })}

        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-void/90 flex flex-col items-center justify-center z-10 border-4 border-glitch-cyan m-4">
            {gameOver ? (
              <>
                <h2 className="text-5xl font-bold text-glitch-magenta mb-2 glitch" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                <p className="text-white mb-6 text-2xl">FINAL_DATA: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-glitch-magenta text-void text-2xl font-bold hover:bg-white hover:text-void transition-none cursor-pointer uppercase"
                >
                  INITIATE_REBOOT
                </button>
              </>
            ) : !hasStarted ? (
              <button 
                onClick={resetGame}
                className="px-6 py-3 bg-glitch-cyan text-void text-2xl font-bold hover:bg-white hover:text-void transition-none cursor-pointer uppercase"
              >
                EXECUTE_PROGRAM
              </button>
            ) : isPaused ? (
              <>
                <h2 className="text-5xl font-bold text-glitch-cyan mb-6 glitch" data-text="SYSTEM_HALTED">SYSTEM_HALTED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-3 bg-glitch-cyan text-void text-2xl font-bold hover:bg-white hover:text-void transition-none cursor-pointer uppercase"
                >
                  RESUME_EXECUTION
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
      <div className="mt-6 text-glitch-cyan text-xl text-center border-t-4 border-glitch-magenta pt-4 w-full">
        INPUT: [ARROWS/WASD] TO NAVIGATE.<br/>
        INTERRUPT: [SPACE] TO HALT.
      </div>
    </div>
  );
}
