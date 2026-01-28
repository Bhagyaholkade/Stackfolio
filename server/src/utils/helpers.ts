import crypto from 'crypto';

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

export const getLanguageFromExtension = (extension: string): string => {
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    md: 'markdown',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    dockerfile: 'dockerfile',
    makefile: 'makefile',
  };

  return languageMap[extension] || 'plaintext';
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const isTextFile = (filename: string): boolean => {
  const textExtensions = [
    'txt', 'md', 'json', 'xml', 'html', 'css', 'scss', 'less',
    'js', 'jsx', 'ts', 'tsx', 'py', 'rb', 'java', 'go', 'rs',
    'cpp', 'c', 'h', 'cs', 'php', 'swift', 'kt', 'scala',
    'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'env',
    'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd',
    'sql', 'graphql', 'prisma', 'dockerfile', 'makefile',
    'gitignore', 'gitattributes', 'editorconfig', 'prettierrc',
    'eslintrc', 'babelrc', 'npmrc', 'nvmrc',
  ];

  const ext = getFileExtension(filename);
  const basename = filename.toLowerCase();

  return textExtensions.includes(ext) ||
         textExtensions.some(e => basename.endsWith(e)) ||
         basename === 'readme' ||
         basename === 'license' ||
         basename === 'changelog';
};
