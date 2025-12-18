# FormForge - Drag & Drop Form Builder

A comprehensive full-stack SaaS application for creating, publishing, and managing forms with an intuitive drag-and-drop interface.

![FormForge Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=FormForge+Demo)

## Features

### 🎨 Visual Form Builder
- **Drag & Drop Interface**: Intuitive 3-panel layout with field library, canvas, and settings
- **15+ Field Types**: Text, email, phone, dropdown, radio, checkbox, date picker, file upload, rating, and more
- **Real-time Preview**: See your form as you build it
- **Responsive Design**: Forms work perfectly on desktop, tablet, and mobile

### 📊 Advanced Form Features
- **Field Validation**: Required fields, min/max length, regex patterns, custom error messages
- **Conditional Logic**: Show/hide fields based on other field values
- **Multiple Layouts**: Full width, half width, third width field layouts
- **Custom Styling**: Per-field styling options

### 🚀 Publishing & Sharing
- **Live Forms**: Generate public URLs for published forms
- **Embed Codes**: Iframe embed codes for websites
- **Form Status**: Draft, Published, Archived workflow
- **Thank You Pages**: Custom success messages and redirect URLs

### 📈 Analytics & Insights
- **Submission Tracking**: Monitor form submissions and conversion rates
- **Field Analytics**: See which fields have the highest completion rates
- **Export Data**: Download submissions as CSV or JSON
- **Visual Charts**: Submission trends over time

### 🔗 Integrations
- **Email Notifications**: Automatic email alerts for new submissions
- **Webhook Support**: Send form data to external services
- **Google Sheets**: Auto-sync submissions to spreadsheets
- **Zapier Integration**: Connect with 5000+ apps
- **Slack Notifications**: Get notified in your team channels

### 👥 User Management
- **Secure Authentication**: Email/password authentication with NextAuth.js
- **User Dashboard**: Manage all forms, analytics, and settings
- **Form Templates**: Pre-built templates for common use cases
- **Duplicate Forms**: Clone existing forms with one click

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React DnD** for drag-and-drop functionality
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for backend logic
- **NextAuth.js** for authentication
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **bcryptjs** for password hashing

### Deployment
- **Docker** containerization
- **PostgreSQL** with Docker Compose
- **Production-ready** configuration
- **Environment variable** configuration

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/formforge.git
   cd formforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/formforge"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup (Alternative)

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec app npx prisma generate
   docker-compose exec app npx prisma db push
   docker-compose exec app npm run db:seed
   ```

## Usage Guide

### Creating Your First Form

1. **Sign In**: Use the demo account (demo@formforge.com with any password)
2. **Create Form**: Click "New Form" from the dashboard
3. **Add Fields**: Drag fields from the left panel to the canvas
4. **Configure Fields**: Click on fields to edit properties in the right panel
5. **Preview**: Check how your form looks on different devices
6. **Publish**: Click "Publish Form" to make it live
7. **Share**: Get the public URL or embed code

### Using Templates

1. **Browse Templates**: Go to "Templates" in the navigation
2. **Choose Template**: Select from contact forms, lead generation, feedback, etc.
3. **Customize**: Modify the template to your needs
4. **Use Template**: Click "Use Template" to create a new form

### Managing Forms

1. **Dashboard**: Overview of all your forms and analytics
2. **My Forms**: List of all forms with quick actions
3. **Analytics**: Detailed form performance metrics
4. **Settings**: Account and integration settings

## Demo Account

For testing purposes, use these credentials:
- **Email**: demo@formforge.com
- **Password**: Any password (demo authentication)

## API Documentation

### Forms API
- `GET /api/forms` - List user's forms
- `POST /api/forms` - Create new form
- `GET /api/forms/[id]` - Get specific form
- `PUT /api/forms/[id]` - Update form
- `DELETE /api/forms/[id]` - Delete form
- `POST /api/forms/[id]/duplicate` - Duplicate form
- `POST /api/forms/[id]/submit` - Submit form data

### Authentication API
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/session` - Get current session

## Form Schema Structure

Forms are stored as JSON schemas with the following structure:

```typescript
interface FormSchema {
  title: string
  description?: string
  fields: FormField[]
}

interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  width: 'full' | 'half' | 'third'
  validation?: FieldValidation
  options?: FieldOption[]
  conditionalLogic?: ConditionalLogic[]
}
```

## Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://your-domain.com"
   ```

3. **Deploy with Docker**
   ```bash
   docker build -t formforge .
   docker run -p 3000:3000 --env-file .env formforge
   ```

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on git push**

### Railway Deployment

1. **Connect GitHub repository**
2. **Add PostgreSQL service**
3. **Set environment variables**
4. **Deploy automatically**

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.formforge.com](https://docs.formforge.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/formforge/issues)
- **Discord**: [Join our community](https://discord.gg/formforge)
- **Email**: support@formforge.com

## Roadmap

### Upcoming Features
- [ ] Multi-page forms
- [ ] Payment integration (Stripe, PayPal)
- [ ] Advanced conditional logic
- [ ] White-label solutions
- [ ] Team collaboration
- [ ] API rate limiting
- [ ] Advanced analytics dashboard
- [ ] Custom field types
- [ ] Form versioning
- [ ] A/B testing for forms

### Version History
- **v1.0.0** - Initial release with core form builder functionality
- **v1.1.0** - Added templates and analytics
- **v1.2.0** - Integration support and improved UX

---

**Built with ❤️ by the FormForge team**