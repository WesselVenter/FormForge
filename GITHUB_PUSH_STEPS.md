# FormForge GitHub Push Steps

## Step-by-Step Instructions

### 1. Navigate to your project directory
```bash
cd /workspace
```

### 2. Initialize Git repository
```bash
git init
```

### 3. Add all files to git
```bash
git add .
```

### 4. Create your first commit
```bash
git commit -m "Initial FormForge deployment - Full-stack drag-and-drop form builder"
```

### 5. Set main branch
```bash
git branch -M main
```

### 6. Add your GitHub repository as remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/FormForge.git
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username

### 7. Push to GitHub
```bash
git push -u origin main
```

## After pushing to GitHub

Once your code is on GitHub, you can deploy to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your FormForge repository from GitHub
4. Vercel will automatically detect it's a Next.js project
5. Click "Deploy"

## Environment Variables for Vercel

When deploying to Vercel, you'll need to add these environment variables:

- `NEXTAUTH_SECRET`: Generate a random string (you can use `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your Vercel deployment URL (will be provided after deployment)
- `DATABASE_URL`: Your PostgreSQL database URL (if using)
- `SUPABASE_URL`: https://noytpxrmagkfrmegxujt.supabase.co
- `SUPABASE_ANON_KEY`: Your Supabase anon key

## Troubleshooting

If you get authentication errors when pushing:
1. Make sure you're logged into GitHub on your machine
2. Use a personal access token instead of password if prompted
3. Ensure your repository name matches exactly (FormForge)

If you get permission errors:
1. Check that your repository exists on GitHub
2. Make sure you have push access to the repository