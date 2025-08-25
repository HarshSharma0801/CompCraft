# CompCraft

The ultimate visual React component editor with real-time preview, authentication, and cloud storage. Craft beautiful components effortlessly - paste any React component and edit it visually by clicking elements to change text, colors, fonts, and more.

## ✨ Features

- **Visual Editing**: Click any element to edit text content, colors, font size, and font weight
- **Real-time Preview**: See changes instantly as you edit
- **Code Synchronization**: Visual changes automatically update the source code
- **User Authentication**: Secure sign-in/sign-up with Clerk
- **Cloud Storage**: Save and manage components in MongoDB
- **Component Library**: Browse and organize your saved components
- **Public Sharing**: Share components publicly with preview links
- **Clean UI**: Modern black and white design with smooth interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ and npm
- MongoDB database (or MongoDB Atlas)
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd runable
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   MONGODB_URL=your_mongodb_connection_string
   ```

4. **Get Clerk credentials**

   - Go to [clerk.com](https://clerk.com) and create an account
   - Create a new application
   - Copy the publishable key and secret key from the dashboard
   - Add them to your `.env.local` file

5. **Set up MongoDB**

   - The app will automatically create the necessary collections
   - Make sure your MongoDB URL includes the database name (e.g., `/Runable`)

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Guests (No Authentication Required)

- Visit the homepage and click "Try Editor Now"
- Paste any React component code
- Click elements in the preview to edit them visually
- Use Preview button to see changes

### For Authenticated Users

- Sign up/Sign in to save components permanently
- Create components in the editor and save them
- View all your components in the Dashboard
- Edit saved components
- Share public components with preview links
- Delete components you no longer need

## 🛠 API Endpoints

- `POST /api/component` - Create a new component
- `GET /api/component` - Get user's components list
- `GET /api/component/[id]` - Get specific component (authenticated)
- `PUT /api/component/[id]` - Update component
- `DELETE /api/component/[id]` - Delete component
- `GET /api/preview/[id]` - Get public component for preview

## 🏗 Architecture

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editing with syntax highlighting
- **Lucide React** - Icons
- **Babel Standalone** - Runtime JSX transformation

### Backend

- **Next.js API Routes** - RESTful API
- **MongoDB + Mongoose** - Database and ODM
- **Clerk** - Authentication and user management

### Key Components

- `ComponentEditor` - Main editor interface
- `Preview` - Iframe-based component rendering
- `PropertyPanel` - Visual property editing interface
- `CodeEditor` - Monaco-based code editor

## 🎨 Visual Editing Features

### Supported Properties

- **Text Content** - Edit text directly with apply/cancel buttons
- **Text Color** - Color picker with hex input
- **Background Color** - Color picker with hex input
- **Font Size** - Slider and number input (8px - 72px)
- **Font Weight** - Visual weight selector (100-900)

### Element Selection

- Click any element in the preview to select it
- Advanced element matching algorithm ensures precise targeting
- Element signature system prevents conflicts
- Visual outline shows selected element

## 🔧 Development

### Project Structure

```
app/
├── api/           # API routes
├── component/     # Component detail pages
├── dashboard/     # User dashboard
├── editor/        # Standalone editor
├── preview/       # Public preview pages
├── sign-in/       # Authentication pages
└── sign-up/
components/        # React components
lib/              # Utilities (MongoDB, code parsing)
models/           # Database schemas
types/            # TypeScript definitions
```

### Key Files

- `lib/codeParser.ts` - JSX parsing and code modification
- `lib/mongodb.ts` - Database connection
- `models/Component.ts` - Component schema
- `middleware.ts` - Clerk authentication middleware

## 🚀 Deployment

1. **Vercel (Recommended)**

   ```bash
   npm run build
   vercel --prod
   ```

2. **Environment Variables**
   Add the same environment variables to your deployment platform

3. **MongoDB Atlas**
   Use MongoDB Atlas for production database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🐛 Known Issues

- Clerk dependency has a peer dependency warning with Next.js 14.0.4 (resolved with --force flag)
- Some complex React components may require manual code adjustments
- Environment variables must be properly configured for authentication to work

## 💡 Future Enhancements

- Drag and drop component builder
- More CSS property support
- Component templates library
- Collaborative editing
- Export to different formats
- Mobile responsive editor

---

**Happy Coding!** 🎉
