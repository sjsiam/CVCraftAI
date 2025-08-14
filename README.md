# CVCraft - AI-Powered CV Builder

A professional AI-powered CV Builder web application built with Next.js, Tailwind CSS, and OpenAI API.

## Features

- 🚀 **AI-Powered Generation**: Uses OpenAI GPT-4o-mini to generate 3 professional CV templates
- 📱 **Responsive Design**: Mobile-first design optimized for all devices
- 🎨 **Multiple Templates**: Professional, Concise, and Creative CV formats
- 📄 **PDF Export**: Download CVs as high-quality PDF files
- ⚡ **ATS-Optimized**: CVs are optimized for Applicant Tracking Systems
- 🔒 **Privacy-First**: No data storage, everything is processed client-side

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## Usage

### Sample Data

The app includes a "Load Sample Data" button that fills the form with example data for testing.

**Sample Profile: Sarah Johnson**
- Senior Software Engineer with 6+ years experience
- Full-stack development expertise
- Cloud architecture and team leadership experience
- Complete education, experience, and skills data

### OpenAI Prompt Template

The application uses a comprehensive prompt template that:

1. **Optimizes for ATS**: Uses proper keywords, formatting, and structure
2. **Creates 3 Variants**:
   - **Professional**: Traditional corporate format
   - **Concise**: Compact one-page format
   - **Creative**: Modern format with personality touches

3. **Ensures Quality**: Includes quantifiable achievements, proper HTML structure, and semantic formatting

## Technology Stack

- **Frontend**: Next.js 13, React, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **PDF Generation**: html2pdf.js
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Icons**: Lucide React

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` as an environment variable in Vercel
4. Deploy

### Other Platforms

The app is built with Next.js static export and can be deployed to:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── builder/page.tsx      # CV builder form and preview
│   ├── api/generate/route.ts # OpenAI API integration
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/ui/            # Reusable UI components
├── lib/                      # Utility functions
└── public/                   # Static assets
```

## API Routes

### POST /api/generate

Generates 3 CV versions using OpenAI API.

**Request Body:**
```json
{
  "fullName": "string",
  "jobTitle": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string",
  "education": "string",
  "experience": "string",
  "skills": "string",
  "languages": "string",
  "achievements": "string",
  "targetRole": "string"
}
```

**Response:**
```json
{
  "professional": "HTML content",
  "concise": "HTML content", 
  "creative": "HTML content"
}
```

## Customization

### Adding New Templates

1. Modify the prompt in `/app/api/generate/route.ts`
2. Update the UI in `/app/builder/page.tsx` to include new tabs
3. Add corresponding PDF export functionality

### Styling Changes

- Modify `/app/globals.css` for global styles
- Update Tailwind classes in components
- Customize the color scheme in `tailwind.config.ts`

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section below
2. Open an issue on GitHub
3. Review the OpenAI API documentation

## Troubleshooting

### Common Issues

1. **"OpenAI API Error"**: Check your API key and ensure you have credits
2. **PDF Download Not Working**: Ensure html2pdf.js is properly loaded
3. **Form Validation Errors**: Check all required fields are filled
4. **Slow Generation**: OpenAI API can take 10-30 seconds for complex requests

### Environment Variables

Make sure your `.env.local` file exists and contains:
```
OPENAI_API_KEY=sk-...your-key-here
```

## Performance Notes

- The app uses GPT-4o-mini for cost efficiency
- PDF generation happens client-side for privacy
- No data is stored on servers
- Responsive design optimized for mobile and desktop