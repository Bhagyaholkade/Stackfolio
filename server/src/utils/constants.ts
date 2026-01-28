export const REPO_BASE_PATH = process.env.REPO_BASE_PATH || './repositories';

export const DEFAULT_BRANCH = 'main';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_VISIBILITY = ['public', 'private'] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 30,
  MAX_LIMIT: 100,
};

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRE: '7d',
  REFRESH_TOKEN_EXPIRE: '30d',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const REPOSITORY_PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin',
} as const;

export const SUPPORTED_README_FILES = [
  'README.md',
  'README.markdown',
  'README.txt',
  'README',
  'readme.md',
  'readme.markdown',
  'readme.txt',
  'readme',
];

export const GITIGNORE_TEMPLATES: Record<string, string> = {
  node: `# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build
dist/
build/
.next/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
`,
  python: `# Byte-compiled files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
.venv/
env/

# Distribution
dist/
build/
*.egg-info/

# IDE
.idea/
.vscode/
*.swp

# Environment
.env

# Logs
*.log
`,
  java: `# Compiled class files
*.class

# Build directories
target/
build/

# IDE
.idea/
*.iml
.vscode/

# Package files
*.jar
*.war
*.ear

# Logs
*.log
`,
};

export const LICENSE_TEMPLATES: Record<string, string> = {
  mit: `MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
  apache: `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
...
`,
};
