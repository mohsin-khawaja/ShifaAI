# Contributing to ShifaAI

Thank you for your interest in contributing to ShifaAI! This guide will help you get started with contributing to our AI health companion project.

## 🌟 How to Contribute

There are many ways to contribute to ShifaAI:

- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes or new features
- **Documentation**: Improve documentation and guides
- **Testing**: Help test new features and report issues
- **Medical Content**: Contribute verified medical information
- **Islamic Content**: Contribute authentic Islamic healing content

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/yourusername/ShifaAI.git
cd ShifaAI
```

### 2. Set Up Development Environment

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install pytest black flake8 mypy
```

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

## 📝 Development Guidelines

### Code Style

We follow Python PEP 8 standards with some modifications:

```bash
# Format code with Black
black backend/ tests/

# Check linting with flake8
flake8 backend/ tests/

# Type checking with mypy
mypy backend/
```

### Code Structure

- **backend/**: All Python backend code
  - `app.py`: Main FastAPI application
  - `gpt_router.py`: OpenAI integration
  - `cbt.py`: Cognitive Behavioral Therapy module
  - `shifa.py`: Islamic healing module
  - `scraper.py`: Medical content scraper
  - `utils.py`: Utility functions

- **tests/**: Unit tests for all modules
- **web_interface/**: Web frontend files
- **chrome_extension/**: Browser extension

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(cbt): add new breathing exercise for anxiety
fix(shifa): correct Arabic text in healing du'a
docs(setup): update installation instructions
test(api): add tests for medical question endpoint
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_app.py -v

# Run with coverage
pytest tests/ --cov=backend --cov-report=html
```

### Writing Tests

- Write tests for all new features
- Include both positive and negative test cases
- Mock external API calls (OpenAI)
- Test edge cases and error handling

Example test structure:
```python
def test_new_feature():
    """Test description"""
    # Arrange
    input_data = {"question": "test question"}
    
    # Act
    result = function_to_test(input_data)
    
    # Assert
    assert result["status"] == "success"
    assert "response" in result
```

## 🏗️ Adding New Features

### Medical Features
When adding medical content or features:

1. **Verify Sources**: Use only reputable medical sources
2. **Add Disclaimers**: Include appropriate medical disclaimers
3. **Test Thoroughly**: Ensure accuracy and safety
4. **Document Sources**: Reference all medical sources used

### CBT Features
For CBT (Cognitive Behavioral Therapy) features:

1. **Evidence-Based**: Use only evidence-based techniques
2. **Professional Review**: Have mental health professionals review
3. **Clear Instructions**: Provide clear, step-by-step guidance
4. **Safety First**: Include crisis resources and safety information

### Islamic Content (Shifa)
For Islamic healing content:

1. **Authentic Sources**: Use only Quran and authentic Hadith
2. **Arabic Verification**: Ensure correct Arabic text and transliteration
3. **Scholarly Review**: Have Islamic scholars verify content
4. **Balance**: Maintain balance between spiritual and medical guidance

## 🔍 Code Review Process

### Submitting Pull Requests

1. **Create Pull Request**: Submit PR with clear description
2. **Reference Issues**: Link to related issues
3. **Describe Changes**: Explain what was changed and why
4. **Include Tests**: Ensure tests pass and coverage is maintained
5. **Update Documentation**: Update relevant documentation

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Breaking changes documented
```

### Review Criteria

Code will be reviewed for:
- **Functionality**: Does it work as intended?
- **Quality**: Is the code clean and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is it properly documented?
- **Security**: Are there any security concerns?
- **Performance**: Does it impact performance?

## 📚 Documentation

### API Documentation
- Update OpenAPI schemas for new endpoints
- Include examples in docstrings
- Document all parameters and responses

### Code Documentation
```python
def new_function(param1: str, param2: int) -> dict:
    """
    Brief description of what the function does.
    
    Args:
        param1: Description of parameter 1
        param2: Description of parameter 2
    
    Returns:
        dict: Description of return value
        
    Raises:
        ValueError: When parameter validation fails
    """
```

### User Documentation
- Update README for new features
- Add setup instructions for new requirements
- Include examples and use cases

## 🛡️ Security Guidelines

### Sensitive Data
- Never commit API keys or secrets
- Use environment variables for configuration
- Sanitize user input
- Validate all external data

### Medical Safety
- Include appropriate disclaimers
- Never provide emergency medical advice
- Encourage professional medical consultation
- Test medical content thoroughly

### Privacy
- Protect user data and conversations
- Follow data protection regulations
- Minimize data collection
- Secure data transmission

## 🚨 Issue Reporting

### Bug Reports
Include:
- **Environment**: OS, Python version, dependencies
- **Steps to Reproduce**: Clear reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Logs**: Relevant error messages or logs
- **Screenshots**: If applicable

### Feature Requests
Include:
- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: Your suggested implementation
- **Alternatives**: Other solutions considered
- **Use Cases**: How would this be used?
- **Priority**: How important is this feature?

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different perspectives and experiences

### Communication
- Use clear, professional language
- Be patient with questions and reviews
- Provide helpful, actionable feedback
- Celebrate contributions and achievements

### Collaboration
- Share knowledge and resources
- Help review others' contributions
- Mentor new contributors
- Participate in discussions and planning

## 📋 Development Workflow

### 1. Planning
- Discuss significant changes in issues first
- Break large features into smaller tasks
- Consider impact on existing functionality
- Plan for testing and documentation

### 2. Implementation
- Write clean, readable code
- Follow established patterns
- Add comprehensive tests
- Update documentation

### 3. Review
- Self-review your changes
- Address feedback promptly
- Ensure CI passes
- Update based on review comments

### 4. Deployment
- Merge when approved
- Monitor for issues
- Be available for follow-up
- Celebrate the contribution!

## 🏷️ Release Process

### Versioning
We use semantic versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Tagged in git
- [ ] Release notes created

## 📞 Getting Help

### Resources
- **Documentation**: Check existing docs first
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Code**: Review existing code for patterns

### Asking Questions
- Provide context and details
- Include relevant code snippets
- Explain what you've already tried
- Be specific about what you need help with

## 🙏 Recognition

### Contributors
All contributors will be:
- Listed in the contributors section
- Credited in release notes
- Invited to maintainer discussions (regular contributors)
- Recognized for their specific contributions

### Types of Contributions
We value all types of contributions:
- Code contributions
- Bug reports and testing
- Documentation improvements
- Community support
- Medical/Islamic content review
- Feature ideas and feedback

Thank you for contributing to ShifaAI! Your efforts help make healthcare more accessible and culturally sensitive for everyone. 