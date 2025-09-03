# 📚 Study Timer - Advanced Pomodoro Timer with Analytics

A comprehensive web-based Pomodoro study timer application with advanced analytics, ambient sounds, goal tracking, and beautiful data visualizations. Built with Next.js 15, TypeScript, and modern web technologies.

![Study Timer Screenshot](./public/screenshot.png)

## ✨ Features

### 🍅 Core Timer Functionality
- **Pomodoro Timer**: Standard 25-minute work sessions with 5-minute breaks
- **Customizable Durations**: Adjust timer lengths to fit your preferences
- **Auto-start Sessions**: Automatically begin next session or break
- **Keyboard Shortcuts**: Spacebar to start/pause, ESC to reset
- **Visual & Audio Notifications**: Never miss a session end
- **Session Progress**: Track current session number and type

### 📊 Advanced Analytics
- **Session History**: Detailed logs of all your study sessions
- **Productivity Trends**: Track your progress over time
- **Subject Analysis**: See how much time you spend on different topics
- **Study Heatmap**: Visual calendar of your study patterns
- **Goal Tracking**: Set and monitor daily/weekly study goals
- **Export Data**: Download your progress in JSON, CSV, or PDF formats

### 🎵 Focus Features
- **Ambient Sounds**: Built-in nature sounds and white noise
- **Focus Mode**: Website blocking suggestions during study sessions
- **Distraction Tracking**: Log and analyze what breaks your concentration
- **Pomodoro Session Management**: Pre-configured focus sessions

### 🏆 Gamification
- **Achievement System**: Unlock badges for study milestones
- **Streak Tracking**: Maintain consistent study habits
- **Progress Levels**: Visual progress indicators and rewards
- **Study Statistics**: Comprehensive overview of your productivity

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Themes**: Choose your preferred appearance
- **PWA Support**: Install as a desktop or mobile app
- **Accessibility**: Screen reader compatible and keyboard navigable
- **Customizable Interface**: Adjust colors, layout, and settings

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: NextAuth.js
- **Charts**: Recharts for data visualization
- **PWA**: Next-PWA for app-like experience
- **Audio**: Web Audio API for sound generation
- **State Management**: Zustand + TanStack Query

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/study-timer.git
   cd study-timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/study_timer"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checker
- `db:generate` - Generate Prisma client
- `db:push` - Push schema to database
- `db:studio` - Open Prisma Studio

## 📱 PWA Installation

The Study Timer can be installed as a Progressive Web App:

1. **Desktop**: Click the install icon in your browser's address bar
2. **Mobile**: Use "Add to Home Screen" from your browser menu
3. **Features**: Offline support, push notifications, native app experience

## 🎯 Usage Guide

### Getting Started
1. **Sign up/Login**: Create an account or sign in
2. **Choose a Subject**: Select or create a study subject
3. **Start Timer**: Click play to begin a 25-minute focus session
4. **Take Breaks**: Enjoy 5-minute breaks between sessions
5. **Track Progress**: View your analytics and achievements

### Advanced Features
- **Set Goals**: Define daily or weekly study targets
- **Focus Mode**: Block distracting websites during sessions
- **Ambient Sounds**: Choose background sounds for concentration
- **Notes**: Add reflections and notes to your study sessions
- **Export Data**: Download your progress for external analysis

## 🔒 Security Features

- **Authentication**: Secure user registration and login
- **Data Protection**: Encrypted user data and secure sessions
- **Privacy First**: Your study data belongs to you
- **GDPR Compliant**: European privacy regulation compliance
- **Input Validation**: Protected against common web vulnerabilities

## 🧪 Testing

The application includes comprehensive testing:

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Docker
```bash
docker build -t study-timer .
docker run -p 3000:3000 study-timer
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@studytimer.app
- 💬 Discord: [Join our community](https://discord.gg/studytimer)
- 📖 Documentation: [docs.studytimer.app](https://docs.studytimer.app)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/yourusername/study-timer/issues)

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible UI components
- [Prisma](https://prisma.io/) - Next-generation ORM for databases
- [Recharts](https://recharts.org/) - Composable charting library
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

---

**Built with ❤️ for productivity enthusiasts and students worldwide.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/study-timer)