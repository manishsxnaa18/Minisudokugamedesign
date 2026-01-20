import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import type { User } from '../types/user';

// Dev mode - set to true for auto-fill OTP during development
const DEV_MODE = true;
const DEV_OTP = '123456';

interface VerificationScreenProps {
  phone: string;
  countryCode: string;
  onVerify: (user: User) => void;
  onBack: () => void;
}

export function VerificationScreen({ phone, countryCode, onVerify, onBack }: VerificationScreenProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill OTP in dev mode
  useEffect(() => {
    if (DEV_MODE) {
      setTimeout(() => {
        setOtp(DEV_OTP);
      }, 500);
    }
  }, []);

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock verification (in real app, verify with backend)
      if (otp === DEV_OTP || otp.length === 6) {
        toast.success('Verification successful!');
        onVerify({
          phone,
          countryCode,
          name: 'Player',
        });
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    }, 1000);
  };

  const handleResend = () => {
    toast.success('OTP resent successfully!');
    setOtp('');
    
    // Auto-fill again in dev mode
    if (DEV_MODE) {
      setTimeout(() => {
        setOtp(DEV_OTP);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background decorations */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-sky-300/30 to-cyan-300/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-300/30 to-cyan-300/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-teal-200/20 rounded-full blur-3xl"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-2 border-sky-200/50 backdrop-blur-sm bg-white/95 overflow-hidden relative">
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-200/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full blur-2xl" />
          
          <CardHeader className="space-y-1 relative z-10">
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="relative w-20 h-20 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl text-center bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent font-bold">
                Verify OTP
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CardDescription className="text-center text-base">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-slate-700">{countryCode} {phone}</span>
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {DEV_MODE && (
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-900 border-2 border-yellow-300/50 shadow-md">
                  🔧 Dev Mode: Auto-filled
                </Badge>
              </motion.div>
            )}

            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </motion.div>

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleVerify}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative overflow-hidden group"
                  size="lg"
                  disabled={isLoading || otp.length !== 6}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  </span>
                </Button>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-100/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Change Number
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  className="text-sky-600 hover:text-sky-700 hover:bg-sky-100/50 font-semibold"
                >
                  Resend OTP
                </Button>
              </motion.div>
            </div>

            {!DEV_MODE && (
              <motion.p 
                className="text-xs text-center text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                For demo, use any 6-digit code (or 123456)
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}