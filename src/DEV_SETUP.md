# Mini Sudoku - Development Setup

## Features Added

### 1. Country Code Dropdown
- **Location**: Login Screen
- **Implementation**: 30+ countries with flags and country codes
- **Component**: shadcn/ui Select component
- **File**: `/utils/countries.ts` contains the country list

### 2. Dev Mode OTP Auto-fill
- **Location**: Verification Screen
- **Status**: ENABLED by default
- **Configuration**:
  ```typescript
  // In /components/VerificationScreen.tsx
  const DEV_MODE = true;  // Set to false for production
  const DEV_OTP = '123456';
  ```
- **Behavior**: 
  - Auto-fills OTP field after 500ms
  - Shows "Dev Mode: Auto-filled" badge when enabled
  - Allows testing without manually entering OTP

### 3. Updated User Type
The User type now includes `countryCode`:
```typescript
export interface User {
  phone: string;
  countryCode: string;  // NEW
  name?: string;
  avatar?: string;
}
```

## Quick Start for Development

1. **Login Flow**:
   - Click "Get Started"
   - Select country from dropdown (default: India +91)
   - Enter any 10-digit phone number
   - OTP will auto-fill (DEV_MODE enabled)
   - Click "Verify & Continue"

2. **Disable Dev Mode**:
   - Open `/components/VerificationScreen.tsx`
   - Change `const DEV_MODE = true;` to `const DEV_MODE = false;`

3. **Production Setup**:
   - Set `DEV_MODE = false` in VerificationScreen.tsx
   - Implement real OTP API integration
   - Update country list as needed in `/utils/countries.ts`

## Files Modified/Created
- ✅ `/utils/countries.ts` - Country list
- ✅ `/types/user.ts` - Updated User interface
- ✅ `/components/LoginScreen.tsx` - Added country dropdown
- ✅ `/components/VerificationScreen.tsx` - Added dev mode auto-fill
- ✅ `/components/Header.tsx` - Display country code with phone
- ✅ `/App.tsx` - Handle country code in state

## Testing
The app is ready for testing with:
- Country selection working
- Phone validation (10 digits minimum)
- Auto-filled OTP for quick testing
- Full authentication flow
