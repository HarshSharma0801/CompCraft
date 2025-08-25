# 🚀 CompCraft Visual Editor

**Revolutionary AI-Powered Visual React Component Editor**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.18.0-green)](https://mongodb.com/)

## Video


https://github.com/user-attachments/assets/40e442cf-de50-4058-be3b-d41c3af55924


# Screenshots

<img width="1470" height="796" alt="Screenshot 2025-08-26 at 1 12 00 AM" src="https://github.com/user-attachments/assets/f56a3923-6aae-48eb-b218-3dcd75474682" />

<img width="1470" height="796" alt="Screenshot 2025-08-26 at 1 11 51 AM" src="https://github.com/user-attachments/assets/389bec22-57dd-4307-9f79-f579d3c74298" />

<img width="1470" height="796" alt="Screenshot 2025-08-26 at 1 11 20 AM" src="https://github.com/user-attachments/assets/e2a1a18f-77ef-4bb3-ba84-0ff4ccff410f" />

<img width="1470" height="796" alt="Screenshot 2025-08-26 at 1 11 13 AM" src="https://github.com/user-attachments/assets/1c483ed7-e97b-465b-8b3e-3b186bc6b1c3" />


## 🤖 AI-Powered Features

### **Smart Component Generation**

- **Natural Language to Code**: Describe any component in plain English and watch it come to life
- **Google Gemini Integration**: Powered by Google's latest Gemini 1.5-flash model for high-quality code generation
- **Context-Aware**: AI understands modern React patterns, Tailwind CSS, and responsive design

### **Intelligent Code Parsing**

- **Real-time Syntax Analysis**: Advanced Babel-based parsing for instant component understanding
- **Multi-attribute Matching**: Sophisticated element identification using signatures, classes, and positioning
- **Smart Text Replacement**: Precise content updates with fallback strategies

## 🎨 Interactive Frontend

### **Live Visual Editing**

- **Click-to-Edit**: Simply click on any element in the preview to start editing
- **Real-time Preview**: See changes instantly with split-pane editor and live preview
- **Property Panel**: Comprehensive editing controls for text, colors, fonts, and styles

### **Modern UI/UX**

- **Beautiful Gradients**: Stunning visual design with animated backgrounds and smooth transitions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark/Light Themes**: Adaptive theming for comfortable coding in any environment

### **Advanced Preview System**

- **Isolated Sandbox**: Safe component rendering in iframe with full React support
- **Interactive Elements**: Hover effects and click handlers for intuitive interaction
- **Error Handling**: Graceful error display with helpful debugging information

## 🛠️ Technical Features

### **Code Editor**

- **Monaco Editor**: Professional code editing with syntax highlighting and IntelliSense
- **Real-time Sync**: Seamless synchronization between code and visual changes
- **Read-only Mode**: Safe viewing of components with full functionality

### **Component Management**

- **Cloud Storage**: Save and manage components with MongoDB integration
- **User Authentication**: Secure user accounts with Clerk authentication
- **Version Control**: Track changes and component history

### **Performance Optimized**

- **Dynamic Imports**: Lazy loading for optimal bundle size
- **Efficient Rendering**: Optimized React components with proper memoization
- **Fast AI Responses**: Optimized API calls with proper error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database
- Google Gemini API key

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd compcraft
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Create .env.local file
cp .env.example .env.local

# Add your keys
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🎯 How to Use

### Creating Components with AI

1. Navigate to the editor (`/editor`)
2. Click the **AI button** (✨) in the code editor
3. Describe your component: _"Create a beautiful pricing card with gradient background and hover effects"_
4. Watch as AI generates production-ready React code
5. Edit visually by clicking elements in the preview

### Manual Component Creation

1. Paste your existing React component code
2. Click **Preview** to see it rendered
3. Click on any element to edit its properties
4. Use the property panel for fine-tuned control
5. Save your component to the cloud

### Visual Editing Workflow

1. **Select Element**: Click any element in the live preview
2. **Edit Properties**: Use the property panel to modify text, colors, fonts
3. **Real-time Updates**: See changes instantly reflected in the preview
4. **Code Sync**: All visual changes are automatically synced to the code

## 📁 Project Structure

```
compcraft/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── ai/           # AI component generation
│   │   └── component/    # Component CRUD operations
│   ├── dashboard/        # User dashboard
│   ├── editor/          # Main visual editor
│   └── preview/         # Component preview pages
├── components/           # React components
│   ├── CodeEditor.tsx   # Monaco code editor
│   ├── ComponentEditor.tsx # Main editor interface
│   ├── Preview.tsx      # Live component preview
│   └── PropertyPanel.tsx # Visual property editor
├── lib/                 # Utility functions
│   ├── codeParser.ts   # Code parsing and manipulation
│   └── mongodb.ts      # Database connection
└── types/              # TypeScript definitions
```

## 🏗️ Architecture

### **Frontend Architecture**

- **Next.js 15**: App router with server components
- **TypeScript**: Full type safety throughout
- **Tailwind CSS**: Utility-first styling
- **Clerk**: Authentication and user management

### **Backend Architecture**

- **API Routes**: Serverless functions for AI and CRUD operations
- **MongoDB**: Document database for component storage
- **Mongoose**: ODM for data modeling

### **AI Integration**

- **Google Gemini 1.5-flash**: Latest AI model for code generation
- **Prompt Engineering**: Carefully crafted prompts for consistent results
- **Error Handling**: Robust error handling for API failures

## 🎨 Customization

### **Themes and Styling**

- Easily customizable color schemes
- Configurable gradients and animations
- Extensible component library

### **AI Prompts**

- Modify AI generation prompts in `/api/ai/route.ts`
- Add new component templates
- Customize code generation rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini**: For powering the AI component generation
- **Next.js Team**: For the incredible React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Monaco Editor**: For the professional code editing experience

## 📞 Support

For support, email support@compcraft.dev or join our Discord community.

---

**Made with ❤️ for developers who want to build beautiful components faster**

[Get Started →](https://compcraft.dev) | [Documentation →](https://docs.compcraft.dev) | [Community →](https://discord.gg/compcraft)
