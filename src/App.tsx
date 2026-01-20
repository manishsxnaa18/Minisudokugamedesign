import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { UserProvider, useUser } from './contexts/UserContext';
import { IntroScreen } from './components/IntroScreen';
import { LoginScreen } from './components/LoginScreen';
import { VerificationScreen } from './components/VerificationScreen';
import { Header } from './components/Header';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { GameStats } from './components/GameStats';
import { SettingsDrawer } from './components/SettingsDrawer';
import { HowToPlayDialog } from './components/HowToPlayDialog';
import { AnimatedBackground } from './components/AnimatedBackground';
import type { GameConfig, GameState } from './types/game';
import type { User } from './types/user';
import { soundManager } from './utils/sounds';

type Screen = 'intro' | 'login' | 'verify' | 'setup' | 'game';

function AppContent() {
  const { user, setUser, settings } = useUser();
  const [screen, setScreen] = useState<Screen>('intro');
  const [pendingPhone, setPendingPhone] = useState('');
  const [pendingCountryCode, setPendingCountryCode] = useState('');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  // Update sound manager when settings change
  soundManager.setEnabled(settings.soundEnabled);

  const handleGetStarted = () => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    setScreen('login');
  };

  const handleSendOTP = (phone: string, countryCode: string) => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    setPendingPhone(phone);
    setPendingCountryCode(countryCode);
    setScreen('verify');
  };

  const handleVerify = (userData: User) => {
    soundManager.success();
    setUser(userData);
    setScreen('setup');
  };

  const handleBackToLogin = () => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    setScreen('login');
  };

  const handleStartGame = (config: GameConfig) => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    setGameConfig(config);
    setGameState({
      currentGrid: config.initialGrid,
      isComplete: false,
      elapsedTime: 0,
      hintsUsed: 0,
      mistakes: 0,
    });
    setScreen('game');
  };

  const handleRestart = () => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    if (gameConfig) {
      setGameState({
        currentGrid: gameConfig.initialGrid,
        isComplete: false,
        elapsedTime: 0,
        hintsUsed: 0,
        mistakes: 0,
      });
    }
  };

  const handleNewGame = () => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    setGameConfig(null);
    setGameState(null);
    setScreen('setup');
  };

  const handleLogout = () => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    setUser(null);
    setGameConfig(null);
    setGameState(null);
    setScreen('intro');
  };

  if (screen === 'intro') {
    return <IntroScreen onGetStarted={handleGetStarted} />;
  }

  if (screen === 'login') {
    return <LoginScreen onSendOTP={handleSendOTP} />;
  }

  if (screen === 'verify') {
    return (
      <VerificationScreen
        phone={pendingPhone}
        countryCode={pendingCountryCode}
        onVerify={handleVerify}
        onBack={handleBackToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10 bg-gradient-to-br from-slate-50/90 to-sky-50/90 min-h-screen backdrop-blur-sm">
        <Header
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
          onLogout={handleLogout}
        />

        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {screen === 'setup' ? (
            <GameSetup onStartGame={handleStartGame} />
          ) : (
            <div className="space-y-6">
              <GameStats
                gameState={gameState!}
                onRestart={handleRestart}
                onNewGame={handleNewGame}
              />
              <GameBoard
                config={gameConfig!}
                gameState={gameState!}
                setGameState={setGameState}
              />
            </div>
          )}
        </div>

        <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
        <HowToPlayDialog open={howToPlayOpen} onOpenChange={setHowToPlayOpen} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
      <Toaster position="top-center" />
    </UserProvider>
  );
}