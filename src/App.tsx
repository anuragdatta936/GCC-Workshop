import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-void text-glitch-cyan font-mono pb-24 crt relative selection:bg-glitch-magenta selection:text-void">
      <div className="noise"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <header className="text-center mb-8 border-b-4 border-glitch-magenta pb-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter glitch" data-text="SYS.SNAKE_PROTOCOL">
            SYS.SNAKE_PROTOCOL
          </h1>
          <p className="text-glitch-magenta mt-2 tracking-widest text-2xl">
            [STATUS: ONLINE] // AURAL_STIMULUS_ACTIVE
          </p>
        </header>

        <main className="flex-grow flex items-center justify-center">
          <SnakeGame />
        </main>
      </div>

      <MusicPlayer />
    </div>
  );
}
