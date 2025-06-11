"use client"

import { useState, useEffect } from "react"
import { CreativeCard } from "./creative-card"
import { MarkerText } from "./marker-text"
import { Button } from "@/components/ui/button"
import { RotateCcw, Trophy } from "lucide-react"

export function InteractiveGame() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 50, y: 50 })
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setGameActive(false)
      if (score > highScore) {
        setHighScore(score)
      }
    }
    return () => clearInterval(interval)
  }, [gameActive, timeLeft, score, highScore])

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setGameActive(true)
    moveTarget()
  }

  const moveTarget = () => {
    setClickPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    })
  }

  const handleTargetClick = () => {
    if (gameActive) {
      setScore(score + 1)
      moveTarget()
    }
  }

  return (
    <section id="play" className="py-20 relative">
      <div className="absolute inset-0 bg-black"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white relative">
          <MarkerText color="orange">Interactive Zone</MarkerText>
          <div className="absolute -top-2 -left-4 w-4 h-4 border border-orange-500/50 transform rotate-45"></div>
        </h2>

        <div className="max-w-2xl mx-auto">
          <CreativeCard variant="highlighted" className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2 relative">
                <MarkerText color="yellow">Click Challenge</MarkerText>
              </h3>
              <p className="text-gray-400 text-sm">Click the moving target as many times as you can in 30 seconds!</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">{score}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{timeLeft}</div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{highScore}</div>
                <div className="text-xs text-gray-500">Best</div>
              </div>
            </div>

            <CreativeCard className="h-64 relative mb-6 cursor-crosshair overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5"></div>
              {gameActive && (
                <button
                  className="absolute w-8 h-8 bg-orange-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 animate-pulse"
                  style={{
                    left: `${clickPosition.x}%`,
                    top: `${clickPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={handleTargetClick}
                />
              )}
              {!gameActive && timeLeft === 0 && score > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">Game Over!</div>
                    <div className="text-sm text-gray-400">Final Score: {score}</div>
                  </div>
                </div>
              )}
              {!gameActive && timeLeft === 30 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-lg mb-2">Ready to play?</div>
                    <div className="text-sm">Click start to begin!</div>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500/20 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-2 h-6 bg-orange-500/10 transform rotate-12"></div>
            </CreativeCard>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={startGame}
                disabled={gameActive}
                className="bg-orange-500 hover:bg-orange-600 text-black"
              >
                {gameActive ? "Playing..." : "Start Game"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setScore(0)
                  setTimeLeft(30)
                  setGameActive(false)
                }}
                className="border-white/20 bg-black/60 hover:bg-black/80 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CreativeCard>
        </div>
      </div>
    </section>
  )
}
