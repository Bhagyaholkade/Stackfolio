# 🤝 Contributing to Stackfolio

Thank you for your interest in contributing to Stackfolio! We're excited to have you as part of our community. This guide will help you get started with contributing to our cyberpunk-inspired code collaboration platform.

## 🌟 Ways to Contribute

- 🐛 **Bug Reports** - Help us identify and fix issues
- ✨ **Feature Requests** - Suggest new features and improvements
- 💻 **Code Contributions** - Submit bug fixes and new features
- 📚 **Documentation** - Improve our docs and guides
- 🎨 **Design** - Enhance UI/UX and visual elements
- 🧪 **Testing** - Help improve test coverage
- 🌐 **Translations** - Help make Stackfolio accessible worldwide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 7+
- Git
- Basic knowledge of React, TypeScript, and Node.js

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Stackfolio.git
   cd Stackfolio
   ```

2. **Set up the development environment**
   ```bash
   # Install dependencies
   cd client && npm install
   cd ../server && npm install
   
   # Copy environment files
   cp server/.env.example server/.env
   ```

3. **Start the development servers**
   ```bash
   # Option 1: Using Docker (Recommended)
   docker-compose up -d
   
   # Option 2: Manual setup
   # Terminal 1: MongoDB
   mongod
   
   # Terminal 2: Backend
   cd server && npm run dev
   
   # Terminal 3: Frontend
   cd client && npm run dev
   ```

## 📝 Development Guidelines

### Code Style
- Use **TypeScript** for type safety
- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable and function names**
- Write **self-documenting code** with comments where necessary
- Follow **React best practices** and hooks patterns

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(auth): add OAuth login support
fix(ui): resolve button hover animation glitch
docs(readme): update installation instructions
style(dashboard): improve card spacing and colors
refactor(api): optimize repository query performance
test(auth): add unit tests for login validation
```

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding tests

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Ensure all tests pass
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Run tests
   npm test
   
   # Check linting
   npm run lint
   
   # Build the project
   npm run build
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat(feature): add amazing new feature"
   git push origin feature/amazing-new-feature
   ```

5. **Create a Pull Request**
   - Use a clear, descriptive title
   - Provide a detailed description of changes
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

## 🎨 Design Guidelines

### UI/UX Principles
- **Cyberpunk Aesthetic** - Maintain the futuristic, neon-inspired theme
- **Glassmorphism** - Use frosted glass effects consistently
- **Accessibility** - Ensure all components are accessible
- **Responsive Design** - Support all device sizes
- **Performance** - Optimize animations and interactions

### Color Palette
```css
🟣 Electric Violet  #8b5cf6  /* Primary */
🩷 Cyber Pink      #ff1493  /* Accent */
🩵 Neon Cyan       #00ffff  /* Interactive */
🟢 Aurora Green    #22c55e  /* Success */
🟠 Sunset Orange   #fb923c  /* Warning */
⚫ Deep Space      #0f0f23  /* Background */
```

### Animation Guidelines
- Use **smooth easing functions** (cubic-bezier)
- Keep animations **under 300ms** for interactions
- Use **staggered animations** for lists
- Implement **reduced motion** support
- Test on **lower-end devices**

## 🧪 Testing

### Testing Strategy
- **Unit Tests** - Test individual components and functions
- **Integration Tests** - Test component interactions
- **E2E Tests** - Test complete user workflows
- **Visual Regression Tests** - Ensure UI consistency

### Writing Tests
```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies holographic variant styles', () => {
    render(<Button variant="holographic">Holographic</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-holographic');
  });
});
```

## 📚 Documentation

### Documentation Standards
- Use **clear, concise language**
- Include **code examples** where helpful
- Add **screenshots** for UI components
- Keep **README files** up to date
- Document **API endpoints** thoroughly

### JSDoc Comments
```typescript
/**
 * Creates a new repository with the specified configuration
 * @param name - The repository name
 * @param description - Optional repository description
 * @param isPrivate - Whether the repository should be private
 * @returns Promise resolving to the created repository
 */
async function createRepository(
  name: string,
  description?: string,
  isPrivate: boolean = false
): Promise<Repository> {
  // Implementation
}
```

## 🐛 Bug Reports

### Before Submitting
- Check if the bug has already been reported
- Try to reproduce the issue consistently
- Test on different browsers/devices if applicable

### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots to help explain the problem.

**Environment**
- OS: [e.g. Windows 11, macOS 13]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node.js version: [e.g. 18.17.0]
- Device: [e.g. Desktop, iPhone 12]
```

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
Any alternative solutions you've considered.

**Additional Context**
Screenshots, mockups, or examples that help explain the feature.
```

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Special badges** for outstanding contributions

## 📞 Getting Help

- 💬 **GitHub Discussions** - Ask questions and share ideas
- 🐛 **GitHub Issues** - Report bugs and request features
- 📧 **Email** - Reach out to maintainers directly
- 💬 **Discord** - Join our community chat

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Our Standards
- **Be respectful** and inclusive
- **Be collaborative** and helpful
- **Be patient** with newcomers
- **Be constructive** in feedback
- **Be professional** in all interactions

---

Thank you for contributing to Stackfolio! Together, we're building the future of code collaboration. 🚀

**Happy coding!** ✨