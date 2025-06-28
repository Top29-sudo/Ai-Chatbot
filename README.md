# AI Chatbot

A modern, feature-rich AI chatbot application built with React, TypeScript, and Tailwind CSS. Experience next-generation AI assistance with advanced reasoning, code generation, creative writing, and data analysis capabilities.

## 🚀 Features

- **Advanced AI Capabilities**: Multi-step reasoning, code generation, creative writing, and data analysis
- **Modern UI/UX**: Beautiful, responsive design with dark/light mode support
- **Real-time Streaming**: Live message streaming with typing indicators
- **Code Highlighting**: Syntax highlighting for 50+ programming languages
- **Export Functionality**: Export conversations as JSON files
- **Sound Effects**: Optional audio feedback for interactions
- **Analytics Dashboard**: Conversation statistics and insights
- **Memory Management**: Context-aware conversations with history retention

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API
- **Styling**: Modern CSS with animations and transitions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-chatbot.git
   cd ai-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your actual API key
   # Get your API key from: https://ai.google.dev/
   ```

4. **Add your API key to .env**
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables Setup

### For Local Development

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Gemini API key:**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create an account or sign in
   - Generate a new API key

3. **Add your API key to `.env`:**
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### For Production Deployment

#### GitHub Pages / Netlify / Vercel
Add environment variables in your hosting platform's dashboard:
- **Variable Name**: `VITE_GEMINI_API_KEY`
- **Variable Value**: Your actual API key

#### Security Notes
- ✅ `.env` files are automatically ignored by git
- ✅ Never commit API keys to public repositories
- ✅ Use `.env.example` to show required variables without exposing secrets
- ✅ The app will show a helpful error if API key is missing

## 🚀 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Git Operations
- `npm run git:init` - Initialize git repository with initial commit
- `npm run git:add` - Stage all changes
- `npm run git:commit "message"` - Commit with message
- `npm run git:push` - Push to origin main
- `npm run git:status` - Check git status
- `npm run git:log` - View recent commits

### Deployment
- `npm run deploy:setup` - Prepare build for deployment
- `npm run deploy:github` - Deploy to GitHub Pages
- `npm run release` - Build, commit, and push release

## 🔧 Git Setup

### Initial Setup
```bash
# Initialize repository
npm run git:init

# Add remote origin
git remote add origin https://github.com/yourusername/ai-chatbot.git

# Push to GitHub
npm run git:push
```

### Daily Workflow
```bash
# Make changes to your code
# Stage and commit changes
npm run git:add
npm run git:commit "Your commit message"

# Push to GitHub
npm run git:push
```

### Quick Release
```bash
# Build, commit, and push in one command
npm run release
```

## 🌐 Deployment Options

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Add `VITE_GEMINI_API_KEY` to repository secrets
3. Run deployment script:
   ```bash
   npm run deploy:github
   ```

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_GEMINI_API_KEY`

### Vercel
1. Import your GitHub repository to Vercel
2. Add environment variable: `VITE_GEMINI_API_KEY`
3. Deploy with zero configuration

## 📁 Project Structure

```
ai-chatbot/
├── src/
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx
│   │   ├── InputArea.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── StreamingMessage.tsx
│   │   └── TypingIndicator.tsx
│   ├── lib/                 # Utilities and API
│   │   └── gemini.ts
│   ├── types/               # TypeScript types
│   │   └── chat.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example             # Environment variables template
├── .env                     # Your actual environment variables (git-ignored)
├── public/                  # Static assets
├── dist/                    # Build output
└── package.json
```

## 🎨 Customization

### Themes
- Toggle between light and dark modes
- Customize colors in `tailwind.config.js`
- Modify gradients and animations in components

### AI Behavior
- Adjust system prompts in `src/lib/gemini.ts`
- Modify temperature and response parameters
- Customize conversation memory settings

## 🔒 Security Best Practices

- ✅ API keys are stored in environment variables
- ✅ `.env` files are git-ignored
- ✅ Example file provided for easy setup
- ✅ Clear error messages for missing configuration
- ✅ No hardcoded secrets in source code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- AI powered by [Google Gemini](https://ai.google.dev/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Made with ❤️ and AI** 🤖