const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');

// Read index.html to extract shared components
const indexHtml = fs.readFileSync(INDEX_PATH, 'utf-8');

// Extract the <head> block contents (everything from <head> to </head>, including styles)
const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/i);
const headContent = headMatch ? headMatch[1] : '';

// Extract the <nav> block
const navMatch = indexHtml.match(/<nav>([\s\S]*?)<\/nav>/i);
const navContent = navMatch ? navMatch[0] : '';

// Extract the <footer> block
const footerMatch = indexHtml.match(/<footer[\s\S]*?>([\s\S]*?)<\/footer>/i);
const footerContent = footerMatch ? footerMatch[0] : '';

// We need a helper to adjust relative paths based on folder depth
function adjustRelativePaths(html, depth) {
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  // Replace references like href="./" or src="./" with proper depth
  return html.replace(/(href|src)="(\.\/)(.*?)"/g, `$1="${prefix}$3"`);
}

function scaffoldPage(relativePath, title, customContent = '') {
  const fullPath = path.join(ROOT_DIR, relativePath);
  const depth = relativePath.split('/').filter(p => !p.endsWith('.html')).length;
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const adjustedHead = adjustRelativePaths(headContent, depth).replace(/<title>.*?<\/title>/, `<title>${title} | PawsPal Connect</title>`);
  const adjustedNav = adjustRelativePaths(navContent, depth);
  const adjustedFooter = adjustRelativePaths(footerContent, depth);
  
  // Basic Breadcrumb Generation
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  let breadcrumbTitle = title.split(' | ')[0];
  let parentCrumb = '';
  if (depth > 0) {
     const category = relativePath.split('/')[0];
     parentCrumb = `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="${prefix}#${category}" itemprop="item"><span itemprop="name">${category.charAt(0).toUpperCase() + category.slice(1)}</span></a><meta itemprop="position" content="2" /></li>`;
  }

  const generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${adjustedHead}
</head>
<body>
  ${adjustedNav}

  <!-- ✅ BREADCRUMB -->
  <div class="wrap" style="padding-top: 20px;">
    <ol class="bc-list" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="${prefix}index.html" itemprop="item"><span itemprop="name">Home</span></a>
        <meta itemprop="position" content="1" />
      </li>
      ${parentCrumb}
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="name">${breadcrumbTitle}</span>
        <meta itemprop="position" content="${depth > 0 ? 3 : 2}" />
      </li>
    </ol>
  </div>

  <main style="min-height: 60vh; padding: 40px 0;">
    <div class="wrap">
      <h1>${title}</h1>
      <p style="font-size: 1.1rem; color: var(--slate); margin-top: 10px;">This page is currently being structured. Relevant UI and backend integration matching the PawsPal ecosystem will be deployed here soon.</p>
      ${customContent}
    </div>
  </main>

  ${adjustedFooter}
</body>
</html>`;

  fs.writeFileSync(fullPath, generatedHtml, 'utf-8');
  console.log(`Scaffolded: ${relativePath}`);
}

// Pages to Scaffold
const pages = [
  { path: 'pet-health-records.html', title: 'Pet Health Records' },
  { path: 'ai-vet.html', title: 'AI Vet Consultation' },
  { path: 'pet-marketplace.html', title: 'Pet Marketplace' },
  { path: 'pet-adoption.html', title: 'Pet Adoption Platform' },
  { path: 'platform.html', title: 'Platform Ecosystem' },
  { path: 'pawid.html', title: 'PAWID Identity Engine' },
  { path: 'dashboard.html', title: 'My Pet Dashboard' },
  { path: 'vision.html', title: 'Vision & Investors' },
  { path: 'vet-software.html', title: 'Veterinary Software (VetOS)' },
  { path: 'pet-passport/pet-passport.html', title: 'Pet Passport India' },
  { path: 'emergency-infrastructure/pet-travel-checker.html', title: 'Pet Emergency Services' },
  { path: 'city/bangalore.html', title: 'Pet Services Bangalore' },
  { path: 'city/mumbai.html', title: 'Pet Services Mumbai' },
  { path: 'city/delhi.html', title: 'Pet Services Delhi' },
  { path: 'city/hyderabad.html', title: 'Pet Services Hyderabad' },
  { path: 'blog/how-to-store-pet-health-records.html', title: 'How to Store Pet Health Records' },
  { path: 'blog/best-pet-care-app-india.html', title: 'Best Pet Apps India 2026' },
  { path: 'blog/pet-emergency-guide.html', title: 'Pet Emergency Guide' },
  { path: 'blog/dog-health-tracking.html', title: 'Dog Health Tracking Guide' }
];

pages.forEach(p => scaffoldPage(p.path, p.title));
console.log('UI Injection & Scaffolding Complete!');
