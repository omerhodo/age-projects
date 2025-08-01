# Age Calculator Application

A modern age calculator application. Enter your birth date to learn your current age in detail.

## 🚀 Features

- **Detailed Age Calculation**: Age display in years, months, and days
- **Statistics**: Total days, hours, and minutes calculation
- **Multi-language Support**: Turkish and English language support
- **Responsive Design**: Mobile and desktop compatible
- **Mobile App Support**: Native iOS and Android app with Capacitor
- **Platform Detection**: Smart platform detection with usePlatform hook
- **Material UI**: Modern and user-friendly interface
- **BEM Methodology**: Clean and maintainable CSS structure
- **TypeScript**: Type-safe code development
- **Internationalization**: Full i18n support with react-i18next

## 🛠️ Technologies

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Mobile**: Capacitor for iOS/Android
- **UI Library**: Material UI (MUI)
- **Date Operations**: date-fns
- **Translation**: react-i18next, i18next
- **Styling**: BEM Methodology + CSS Modules
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Turbopack

**Platform Info Properties:**
- `isMobile`: boolean - Is mobile device or narrow screen
- `isNative`: boolean - Is running as native Capacitor app
- `isWeb`: boolean - Is running in web browser
- `platform`: 'ios' | 'android' | 'web' - Current platform
- `isIOS`: boolean - Is iOS platform
- `isAndroid`: boolean - Is Android platform

## 📦 Installation

### Requirements
- Node.js 18+ 
- Yarn 1.22+ (preferred) or npm

### Steps

1. **Clone the project**
```bash
git clone <repository-url>
cd age-projects
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Start the development server**
```bash
yarn dev
# or
npm run dev
```

4. **Open in your browser**
```
http://localhost:3000
```

## 🏗️ Build and Deploy

### Production Build
```bash
yarn build
yarn start
# or
npm run build
npm start
```

### Lint Check
```bash
yarn lint
# or
npm run lint
```

### Additional Scripts
```bash
yarn lint:fix        # Fix lint errors automatically
yarn type-check      # TypeScript type checking
yarn format          # Format code with Prettier
yarn format:check    # Check code formatting
yarn clean           # Clean build directories
yarn reinstall       # Clean reinstall dependencies
```

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Main layout
│   ├── page.tsx           # Main page
│   ├── page.module.css    # Main page styles
│   └── providers.tsx      # Context providers
├── components/            # React components
│   ├── AgeCalculator/     # Age calculator component
│   │   ├── AgeCalculator.tsx
│   │   └── AgeCalculator.css
│   └── LanguageSwitcher/  # Language switcher component
│       ├── LanguageSwitcher.tsx
│       └── LanguageSwitcher.css
├── locales/               # Translation files
│   ├── en.json           # English translations
│   └── tr.json           # Turkish translations
├── i18n.ts               # i18next configuration
└── .github/
    └── copilot-instructions.md
```

## 🎨 BEM Methodology

The project uses BEM (Block Element Modifier) methodology for CSS class naming:

```css
/* Block */
.age-calculator { }

/* Element */
.age-calculator__input { }
.age-calculator__result { }

/* Modifier */
.age-calculator--active { }
.age-calculator__button--primary { }
```

## �🔧 Documentation

Detaylı kurulum ve konfigürasyon rehberleri için [`docs/`](./docs/) klasörüne bakın:

- [Environment Variables Setup](./docs/setup/ENVIRONMENT_SETUP.md) - AdMob ve environment variables kurulumu
- [Android Security Setup](./docs/setup/ANDROID_SECURITY_SETUP.md) - Android keystore ve güvenlik konfigürasyonu

## �🔧 Development

### Creating Components
When creating new components:
- Use TypeScript
- Style with BEM methodology
- Define props interfaces
- Follow export/import conventions

### Style Rules
- Use BEM methodology
- Prefer CSS Modules or styled-components
- Apply responsive design principles
- Customize Material UI theme

## 📱 Responsive Design

The application is optimized for these screen sizes:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px  
- **Mobile**: 320px - 767px

## 🚀 Deploy Options

### Vercel (Recommended)
```bash
yarn global add vercel
# or
npm i -g vercel
vercel
```
