# CS Portfolio Website

A modern, responsive portfolio website built with Next.js 14, featuring a blog, project showcase, resume section, and a powerful admin portal for content management.

## Features

- 🚀 Built with Next.js 14 and TypeScript
- 💨 Styled with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 📝 Advanced blog functionality with markdown support
- 🔬 LaTeX math equation support for research content
- ⚙️ Complete admin portal for content management
- 🎨 Modern, clean UI design
- ⚡ Fast loading and optimized performance
- 📁 File upload system with Vercel Blob storage
- 🔄 Real-time preview with markdown rendering

## Admin Portal

Access the admin portal at `/admin` to manage your portfolio content. The admin panel includes:

### Blog Editor
- **Rich Text Toolbar**: Format text with bold, italic, code blocks, lists, and more
- **LaTeX Math Support**: Insert inline math (`$E = mc^2$`) and display equations (`$$\sum_{i=1}^{n} x_i$$`)
- **Image Upload**: Direct file upload with automatic URL generation
- **Live Preview**: Toggle between edit and preview modes
- **SEO Optimization**: Custom slugs, excerpts, and meta tags

### Project Manager
- Add, edit, and delete projects
- Technology tags and categorization
- GitHub and demo links
- Project image management

### Resume Editor
- Dynamic experience and education sections
- Skills categorization
- Real-time updates to the resume page

## LaTeX Integration for Research

The blog editor includes comprehensive LaTeX support for academic and research content:

```markdown
Inline equations: $E = mc^2$
Display equations: $$\int_0^\infty e^{-x^2} dx$$
Complex formulas: $$\sum_{i=1}^{n} \frac{1}{x_i^2}$$
```

This is powered by:
- `remark-math` for parsing LaTeX syntax
- `rehype-katex` for rendering beautiful mathematical equations
- `katex` for high-quality math typesetting

## Technical Implementation

### Architecture Overview

The portfolio uses a modern Next.js architecture with:

1. **App Router**: Leveraging Next.js 14's app directory structure
2. **Server Components**: For optimal performance and SEO
3. **Client Components**: For interactive features and animations
4. **API Routes**: RESTful endpoints for content management

### Blog System Implementation

The blog system is built with a hybrid approach:

```
app/
├── blog/
│   ├── page.tsx           # Server Component (blog list)
│   ├── BlogList.tsx       # Client Component (animations)
│   └── [slug]/
│       ├── page.tsx       # Server Component (post fetching)
│       └── PostContent.tsx # Client Component (markdown rendering)
├── api/
│   ├── posts/
│   │   ├── route.ts       # GET/POST for all posts
│   │   └── [slug]/
│   │       └── route.ts   # GET/DELETE for individual posts
│   └── upload/
│       └── route.ts       # File upload handling
```

### Data Storage Strategy

- **Posts**: Stored as JSON files in Vercel Blob storage
- **Images**: Uploaded to Vercel Blob with public access
- **Local Data**: Projects and resume data in localStorage with API fallbacks

### Key Technical Features

1. **Markdown Processing Pipeline**:
   ```typescript
   ReactMarkdown + remarkMath + rehypeKatex + rehypeRaw + rehypePrism
   ```

2. **File Upload System**:
   - Direct upload to Vercel Blob storage
   - Automatic URL generation and insertion
   - Loading states and error handling

3. **Content Management**:
   - CRUD operations via REST API
   - Real-time content updates
   - Form validation and data persistence

4. **Performance Optimization**:
   - Dynamic imports for admin components
   - Server-side rendering for blog content
   - Image optimization and lazy loading

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.



## Customization

1. Update personal information in the components
2. Use the admin portal to add projects and blog posts
3. Customize the resume through the admin interface
4. Modify colors and styling in `tailwind.config.js`
5. Add your resume PDF to the public folder

## Content Management Workflow

1. **Creating Blog Posts**:
   - Navigate to `/admin`
   - Click "New Post" in the Blog Posts tab
   - Use the rich text editor with LaTeX support
   - Preview content before publishing

2. **Managing Projects**:
   - Use the Projects tab in the admin panel
   - Add GitHub links, demo URLs, and technology tags
   - Upload project images directly

3. **Updating Resume**:
   - Edit experience, education, and skills
   - Changes reflect immediately on the resume page

## Deployment

This project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds on push

The project can also be deployed on Netlify or any platform supporting Next.js.

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React (icons)
- React Markdown
- KaTeX (LaTeX rendering)
- Vercel Blob (file storage)
- Prism (code highlighting)

## API Endpoints

- `GET /api/posts` - Fetch all blog posts
- `POST /api/posts` - Create/update blog post
- `GET /api/posts/[slug]` - Fetch single blog post
- `DELETE /api/posts/[slug]` - Delete blog post
- `POST /api/upload` - Upload files to blob storage

## License

MIT License
