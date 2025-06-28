# ShifaAI Setup Guide

A comprehensive AI health companion that provides medical guidance, CBT exercises, and Islamic healing insights.

## 📋 Prerequisites

- Python 3.9 or higher
- OpenAI API key
- Git
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ShifaAI.git
cd ShifaAI
```

### 2. Environment Setup

#### Option A: Using Python Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Option B: Using Docker

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your OpenAI API key
nano .env

# Build and run with Docker Compose
docker-compose up --build
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your settings
nano .env
```

**Required configuration:**
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Start the Application

#### Backend API
```bash
# Start the FastAPI backend
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

#### CLI Interface
```bash
# Run the interactive CLI
python ai_simulator.py
```

#### Web Interface
Open your browser and navigate to: `http://localhost:8000`

## 🌐 Interface Options

### 1. Web Interface
- **URL**: `http://localhost:8000`
- **Features**: Modern chat interface with all ShifaAI capabilities
- **Best for**: General use, comprehensive features

### 2. CLI Interface
- **Command**: `python ai_simulator.py`
- **Features**: Terminal-based interaction with 9 menu options
- **Best for**: Testing, development, quick queries

### 3. Chrome Extension
- **Location**: `chrome_extension/`
- **Installation**: See Chrome Extension Setup below
- **Best for**: Quick access while browsing

### 4. REST API
- **Base URL**: `http://localhost:8000`
- **Documentation**: `http://localhost:8000/docs`
- **Best for**: Integration with other applications

## 🔧 Detailed Configuration

### OpenAI API Key Setup

1. **Get your API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

2. **Set the API key:**
   ```bash
   # In your .env file
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Verify API access:**
   ```bash
   # Test the health endpoint
   curl http://localhost:8000/health
   ```

### Advanced Configuration

```env
# Application Settings
LOG_LEVEL=INFO                    # DEBUG, INFO, WARNING, ERROR
MAX_RESPONSE_LENGTH=2000          # Maximum response length
DEBUG=False                       # Enable debug mode

# Feature Flags
ENABLE_CBT=True                   # Enable CBT features
ENABLE_SHIFA=True                 # Enable Islamic healing features
ENABLE_MEDICAL_SCRAPING=True      # Enable medical content scraping

# Server Settings
HOST=0.0.0.0                      # Server host
PORT=8000                         # Server port
```

## 🔌 Chrome Extension Setup

### Install the Extension

1. **Open Chrome Extensions:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)

2. **Load the Extension:**
   - Click "Load unpacked"
   - Select the `chrome_extension` folder
   - The ShifaAI icon should appear in your toolbar

3. **Configure the Extension:**
   - Click the ShifaAI icon
   - Verify connection to localhost:8000
   - Adjust preferences as needed

### Extension Features

- **Health Questions**: Ask questions directly from browser
- **Daily Tips**: Receive health and wellness notifications
- **CBT Exercises**: Quick access to cognitive exercises
- **Islamic Healing**: Du'a and prophetic remedies
- **Context Menu**: Right-click selected text to ask ShifaAI

## 🐳 Docker Deployment

### Development Environment

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Environment

```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Docker Services

- **shifaai**: Main application server
- **redis**: Caching layer (optional)
- **nginx**: Reverse proxy (production)

## 🧪 Testing

### Run Unit Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_app.py -v

# Run with coverage
pytest tests/ --cov=backend --cov-report=html
```

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test ask endpoint
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What helps with headaches?", "include_cbt": false, "include_shifa": false}'
```

## 📊 API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Health & Status
- `GET /health` - Health check
- `GET /stats` - Application statistics

#### Main Features
- `POST /ask` - Ask health questions
- `POST /cbt/exercise` - Get CBT exercises
- `POST /shifa/dua` - Get healing du'as
- `POST /shifa/halal-check` - Verify halal compliance

#### Content Access
- `GET /medical-knowledge` - Browse medical FAQs
- `GET /cbt/daily-tip` - Daily CBT tip
- `GET /shifa/daily-tip` - Daily Islamic health tip

## 🔍 Troubleshooting

### Common Issues

#### 1. OpenAI API Errors
```bash
# Check API key
echo $OPENAI_API_KEY

# Test API connectivity
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 2. Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
uvicorn backend.app:app --port 8001
```

#### 3. Module Import Errors
```bash
# Ensure you're in the virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

#### 4. Chrome Extension Not Working
- Verify the backend is running on localhost:8000
- Check browser console for errors
- Ensure extension has necessary permissions

### Logs and Debugging

```bash
# Check application logs
tail -f logs/shifaai.log

# Enable debug mode
export DEBUG=True

# Run with verbose logging
uvicorn backend.app:app --log-level debug
```

## 🔧 Development Setup

### Code Structure
```
ShifaAI/
├── backend/           # Backend Python modules
├── web_interface/     # Web frontend files
├── chrome_extension/  # Chrome extension
├── tests/            # Unit tests
├── logs/             # Application logs
└── data/             # Data storage
```

### Development Commands

```bash
# Install development dependencies
pip install -r requirements.txt pytest black flake8

# Format code
black backend/ tests/

# Lint code
flake8 backend/ tests/

# Run tests with coverage
pytest tests/ --cov=backend
```

### Environment Variables for Development

```env
DEBUG=True
LOG_LEVEL=DEBUG
OPENAI_API_KEY=your_key_here
```

## 🚀 Production Deployment

### Using Docker in Production

1. **Set up environment:**
   ```bash
   cp .env.example .env.prod
   # Edit .env.prod with production values
   ```

2. **Deploy with Docker:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (optional):**
   - Configure nginx for SSL/TLS
   - Set up domain name and certificates

### Security Considerations

- Use strong API keys
- Enable HTTPS in production
- Set up proper firewall rules
- Regular security updates
- Monitor logs for suspicious activity

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Support

If you encounter issues:

1. Check this setup guide
2. Review the troubleshooting section
3. Check the GitHub issues page
4. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - System information
   - Log files (if applicable)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 