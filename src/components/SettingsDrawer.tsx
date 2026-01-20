import { useState } from 'react';
import { Volume2, VolumeX, CheckSquare, User, Save, Music } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useUser } from '../contexts/UserContext';
import { soundManager } from '../utils/sounds';
import { toast } from 'sonner';

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const { user, setUser, settings, updateSettings } = useUser();
  const [editedName, setEditedName] = useState(user?.name || '');

  const handleSoundToggle = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled });
    soundManager.setEnabled(enabled);
    if (enabled) {
      soundManager.click();
    }
  };

  const handleButtonSoundToggle = (enabled: boolean) => {
    updateSettings({ buttonSoundEnabled: enabled });
    if (enabled) {
      soundManager.click();
    }
  };

  const handleAutoCheckToggle = (enabled: boolean) => {
    updateSettings({ autoCheck: enabled });
  };

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name: editedName });
      toast.success('Profile updated successfully!');
      soundManager.success();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>Customize your game experience</DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold">Profile</h3>
              </div>
              
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl">
                    {editedName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Phone: {user?.countryCode} {user?.phone}</div>
              </div>

              <Button 
                onClick={handleSaveProfile} 
                className="w-full"
                disabled={!editedName.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>

            <Separator />

            {/* Sound Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold">Sound Settings</h3>
              </div>

              {/* All Sounds */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div className="space-y-0.5">
                    <Label htmlFor="sound">All Sound Effects</Label>
                    <p className="text-xs text-muted-foreground">
                      Master control for all sounds
                    </p>
                  </div>
                </div>
                <Switch
                  id="sound"
                  checked={settings.soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>

              {/* Button Sounds */}
              <div className="flex items-center justify-between opacity-100">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${settings.buttonSoundEnabled ? 'bg-indigo-600' : 'bg-muted-foreground'}`} />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="buttonsound">Button Click Sounds</Label>
                    <p className="text-xs text-muted-foreground">
                      Play sound on button clicks
                    </p>
                  </div>
                </div>
                <Switch
                  id="buttonsound"
                  checked={settings.buttonSoundEnabled}
                  onCheckedChange={handleButtonSoundToggle}
                  disabled={!settings.soundEnabled}
                />
              </div>
            </div>

            <Separator />

            {/* Game Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold">Game Settings</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                  <div className="space-y-0.5">
                    <Label htmlFor="autocheck">Auto-Check</Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight mistakes immediately
                    </p>
                  </div>
                </div>
                <Switch
                  id="autocheck"
                  checked={settings.autoCheck}
                  onCheckedChange={handleAutoCheckToggle}
                />
              </div>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
