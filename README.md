# Multi-Tenant SaaS Dashboard Builder

A modern, no-code/low-code dashboard builder built with Next.js 15, React 19, and cutting-edge technologies. Create custom admin panels, data dashboards, and internal tools with drag-and-drop functionality, AI-powered form generation, and real-time collaboration.

## 🚀 Features

- **Drag & Drop Builder**: Visual dashboard creation with intuitive widget placement
- **Multi-Tenant Architecture**: Secure organization-based data isolation with Row Level Security
- **AI-Powered Forms**: Generate forms automatically from database schemas using OpenAI/Claude
- **Real-Time Collaboration**: See team members' cursors and changes live with Liveblocks
- **Dynamic Widgets**: Tables, charts, forms, metrics, and text components
- **Server-Side Operations**: Leverage React 19 Server Actions for seamless data operations
- **Modern UI**: Beautiful interface built with Tailwind CSS and Shadcn/ui

## 🏗️ Technology Stack

### Frontend
- **Next.js 15** with App Router and Partial Prerendering (PPR)
- **React 19** with Server Components and Server Actions
- **TypeScript** for type safety
- **Tailwind CSS 4** + **Shadcn/ui** for styling
- **dnd-kit** for drag-and-drop functionality

### Backend & Database
- **Drizzle ORM** with **PostgreSQL**
- **Row Level Security (RLS)** for multi-tenancy
- **Neon Database** for serverless PostgreSQL

### Authentication & Real-time
- **Clerk** for authentication and user management
- **Liveblocks** for real-time collaboration

### AI Integration
- **OpenAI API** for AI-powered form generation
- Smart schema analysis and UI generation

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (we recommend [Neon](https://neon.tech))
- Clerk account for authentication
- OpenAI API key (optional, for AI features)
- Liveblocks account (optional, for real-time features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dashboard-builder.git
   cd dashboard-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/dashboard_builder"
   
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Optional: Liveblocks (for real-time collaboration)
   LIVEBLOCKS_SECRET_KEY=sk_...
   
   # Optional: OpenAI (for AI form generation)
   OPENAI_API_KEY=sk-...
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Creating Your First Dashboard

1. **Sign up/Sign in** using Clerk authentication
2. **Create a new dashboard** from the dashboards page
3. **Drag widgets** from the left panel onto the canvas
4. **Configure widgets** using the properties panel on the right
5. **Save and share** your dashboard with team members

### Widget Types

- **📊 Table Widget**: Display data in rows and columns with sorting and filtering
- **📈 Chart Widget**: Visualize data with line, bar, pie, and area charts
- **📝 Form Widget**: Collect user input with customizable form fields
- **🔢 Metric Widget**: Show KPIs and key performance indicators
- **📄 Text Widget**: Add formatted text content and documentation

### AI Form Generation

1. Connect to your database through data sources
2. Select a table schema
3. Click "Generate with AI" 
4. AI automatically creates form fields based on your schema
5. Customize the generated form as needed

## 🏢 Multi-Tenant Architecture

The application uses a sophisticated multi-tenant architecture:

- **Organization-based isolation**: Each organization has its own data space
- **Row Level Security (RLS)**: Database-level security ensures data isolation
- **Role-based access control**: Admin, Editor, and Viewer roles
- **Secure API endpoints**: All operations are scoped to the user's organization

## 🎨 React 19 Features Used

- **Server Components**: For initial page renders and data fetching
- **Server Actions**: For form submissions and data mutations
- **useOptimistic()**: For instant UI updates during drag-and-drop
- **use() hook**: For async data loading in components
- **Partial Prerendering (PPR)**: For improved performance

## 📁 Project Structure

```
dashboard-builder/
├── app/                    # Next.js 15 App Router
│   ├── actions/           # Server Actions
│   ├── dashboard/         # Dashboard pages
│   └── dashboards/        # Dashboard list
├── components/            # React components
│   ├── builder/          # Dashboard builder components
│   ├── ui/               # Shadcn/ui components
│   └── widgets/          # Widget implementations
├── lib/                  # Utilities and configurations
│   ├── db/              # Database schema and client
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
# Build the container
docker build -t dashboard-builder .

# Run the container
docker run -p 3000:3000 dashboard-builder
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Clerk](https://clerk.dev/) for authentication
- [Drizzle](https://orm.drizzle.team/) for the excellent ORM
- [Liveblocks](https://liveblocks.io/) for real-time collaboration
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components

## 📞 Support

- 📧 Email: support@dashboardbuilder.com
- 💬 Discord: [Join our community](https://discord.gg/dashboard-builder)
- 📖 Documentation: [docs.dashboardbuilder.com](https://docs.dashboardbuilder.com)

---

Built with ❤️ using Next.js 15, React 19, and modern web technologies.