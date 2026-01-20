import { Settings, LogOut, User, Volume2, VolumeX, HelpCircle, MoreVertical, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useUser } from '../contexts/UserContext';
import { soundManager } from '../utils/sounds';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onLogout: () => void;
}

export function Header({ onOpenSettings, onOpenHowToPlay, onLogout }: HeaderProps) {
  const { user, settings } = useUser();

  const handleMenuClick = (action: () => void) => {
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    action();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="grid grid-cols-2 gap-0.5 p-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white/70 rounded"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-4 h-4 text-amber-400" fill="currentColor" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-700">Mini Sudoku</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Logic Puzzle Game</p>
          </div>
        </motion.div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMenuClick(onOpenHowToPlay)}
              className="hidden sm:flex text-slate-600 hover:bg-slate-100"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Three Dots Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-slate-200">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleMenuClick(onOpenHowToPlay)}>
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Play
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuClick(onOpenSettings)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 mr-2" />
                ) : (
                  <VolumeX className="w-4 h-4 mr-2" />
                )}
                Sound {settings.soundEnabled ? 'On' : 'Off'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="w-9 h-9 border-2 border-sky-200 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-sky-400 to-cyan-400 text-white text-sm font-bold">
                      {user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-slate-200">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || 'Player'}</p>
                  <p className="text-xs text-muted-foreground">{user?.countryCode} {user?.phone}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleMenuClick(onOpenSettings)}>
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleMenuClick(onLogout)} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}