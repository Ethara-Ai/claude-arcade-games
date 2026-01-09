# Deployment Guide

This guide covers different deployment options for the Arcade Games Collection.

## 📋 Pre-Deployment Checklist

- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Performance tested
- [ ] Accessibility checked

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers zero-configuration deployment for Vite apps.

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

**Configuration**: Create `vercel.json` (optional)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy
   ```

3. **Production Deployment**
   ```bash
   netlify deploy --prod
   ```

**Configuration**: Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/arcade-games",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/arcade-games/',
     // ... rest of config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Traditional Server (SSH)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload to server**
   ```bash
   scp -r dist/* user@server:/var/www/arcade-games/
   ```

3. **Configure web server**

   **Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/arcade-games;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

   **Apache configuration (.htaccess):**
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </IfModule>
   ```

### Option 5: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       location / {
           root /usr/share/nginx/html;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Build and run**
   ```bash
   docker build -t arcade-games .
   docker run -p 80:80 arcade-games
   ```

## 🔒 Environment Variables

For production, configure these if needed:

```bash
VITE_APP_TITLE=Arcade Games Collection
```

## 🎯 Performance Optimization

### Build Optimization

Already configured in `vite.config.js`:
- Code splitting
- Tree shaking
- Minification
- Source maps

### Additional Optimizations

1. **Enable gzip compression** (server configuration)
   
   Nginx:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
   ```

2. **Add security headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   ```

3. **Configure caching**
   - Static assets: 1 year
   - HTML: No cache or short cache

## 📊 Monitoring

After deployment, monitor:
- Page load times
- Error rates
- User engagement
- Bundle size

Use tools like:
- Google Analytics
- Sentry (error tracking)
- Lighthouse (performance)

## 🔄 CI/CD with GitHub Actions

Already configured in `.github/workflows/`:
- `ci.yml`: Runs on PRs and pushes
- `cd.yml`: Deploys on main branch

### Required GitHub Secrets

For SSH deployment, add these secrets in GitHub repository settings:

- `DEPLOY_HOST`: Server IP or domain
- `DEPLOY_USER`: SSH username
- `DEPLOY_KEY`: SSH private key
- `DEPLOY_PATH`: Deployment directory path

## 🧪 Testing Deployment

Before going live:

1. **Test locally**
   ```bash
   npm run build
   npm run preview
   ```

2. **Test on staging**
   Deploy to a staging environment first

3. **Performance test**
   - Run Lighthouse audit
   - Test on slow connections
   - Test on mobile devices

4. **Cross-browser test**
   - Chrome
   - Firefox
   - Safari
   - Edge

## 🆘 Troubleshooting

### Build fails
- Check Node.js version (16+)
- Clear `node_modules` and reinstall
- Check for conflicting dependencies

### 404 on refresh
- Configure server to serve `index.html` for all routes
- See server configurations above

### Assets not loading
- Check `base` in vite.config.js
- Verify asset paths
- Check CORS headers

### Slow loading
- Enable gzip compression
- Configure caching headers
- Optimize images
- Check bundle size

## 📝 Post-Deployment

- [ ] Test all games
- [ ] Verify analytics
- [ ] Check error tracking
- [ ] Monitor performance
- [ ] Announce launch! 🎉

## 🔗 Useful Links

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)
- [Web Performance](https://web.dev/performance/)
