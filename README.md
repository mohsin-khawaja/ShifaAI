# ShifaAI
# Pathology AI Patient Simulation

**Your AI health companion: instant medical answers, supportive CBT coaching, and holistic healing guidance.**

An AI-driven patient simulation platform for pathology and medical Q\&A that combines:

* **Medical FAQ Scraper**: Automatically gathers frequently asked questions from trusted medical sources.
* **GPT-4 Medical Engine**: Leverages GPT-4 API to provide accurate, up-to-date medical answers.
* **Empathetic & Optimistic Tone**: Wraps answers in sympathetic language to encourage hope and improvement.
* **CBT Coaching Module**: Appends simple Cognitive Behavioral Therapy exercises to each response.
* **Islamic-Compliant “Shifa AI” Layer**: Integrates prophetic medicine recommendations and du‘ā based on authentic sources.
* **CLI Demo**: `ai_simulator.py` for quick command-line interactions and demos.
* **Chrome Extension UI**: Lightweight in-browser chat widget for easy access.

---

## Features

* **Web Scraping Pipeline**: Python-based scrapers (Scrapy/BeautifulSoup) to collect and preprocess medical FAQs.
* **FastAPI Backend**: Exposes REST endpoints for Q\&A, CBT exercises, and Shifa recommendations.
* **GPT-4 Orchestration**: Central router with system prompts for medical expertise and coaching.
* **Modular CBT Engine**: ABC model, thought records, and guided exercises.
* **Shifa Engine**: Curated du‘ā and prophetic medicines; ensures halal compliance.
* **Containerized Services**: Docker and Docker Compose for local development and production.
* **Automated Testing & CI**: Unit tests for each module and GitHub Actions workflows.

---

## Architecture

```text
[Scraper] → [Preprocessor] → [GPT Router] → [CBT Engine] → [Shifa Engine] → [API]
                   ↑                                  ↓
             SNOMED/LOINC Glossary               CLI & Chrome Extension UI
```

> Full architecture details in `docs/architecture.md`.

---

## Getting Started

### Prerequisites

* Python 3.9+
* `pip` or `poetry`
* (Optional) Docker & Docker Compose

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pathology-ai-patient-simulation.git
cd pathology-ai-patient-simulation

# Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Copy `sample_env` to `.env` and fill in your keys:

```text
OPENAI_API_KEY=your_openai_key_here
# (Optional) Other service credentials
```

### Running the Backend

```bash
# Start FastAPI server
uvicorn backend.app:app --reload
```

### CLI Demo

```bash
python ai_simulator.py
```

### Chrome Extension

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select `chrome_extension/`
4. Use the popup to ask medical questions!

---

## 📁 Project Structure

```text
pathology-ai-patient-simulation/
├── ai_simulator.py             # CLI demo script
├── backend/                    # FastAPI & core logic
│   ├── app.py                  # Entry point
│   ├── scraper.py              # FAQ scraping
│   ├── preprocess.py           # Cleaning & tagging
│   ├── gpt_router.py           # GPT-4 orchestration
│   ├── cbt.py                  # CBT module
│   ├── shifa.py                # Islamic-compliant logic
│   └── utils.py                # Helpers & config
├── chrome_extension/           # In-browser UI
├── docs/                       # Architecture & setup docs
├── tests/                      # Unit & integration tests
├── .github/                    # CI workflows
├── Dockerfile
├── docker-compose.yml
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on setting up your environment, submitting PRs, and our code of conduct.

---

## License

This project is MIT licensed. See [LICENSE](./LICENSE) for details.

---

## Contact

Maintained by **Mohsin Khawaja**. Feel free to open issues or submit pull requests!
