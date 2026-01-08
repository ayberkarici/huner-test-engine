# Hüner AI - Test Workbench

A professional medical microservice test workbench for pharmacists to test SUT (Health Implementation Communiqué) compliance via AI.

## Features

- **Medical Report Extraction**: Paste raw medical report text and extract structured JSON data
- **SUT Compliance Evaluation**: Automatic evaluation of medications against SUT regulations
- **Telemetry Panel**: Full visibility of latency, token usage, and API request/response logs
- **Developer-Focused UI**: Clean, minimalist dashboard with syntax-highlighted JSON output

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React local state

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. **Input Section**: Paste your raw medical report text or click "Örnek Yükle" to load sample data
2. **Process**: Click "İşle" to trigger the extraction
3. **View Results**: 
   - Middle panel shows the structured JSON extraction
   - Right panel shows SUT compliance evaluation for each medication
4. **Telemetry**: Expand the bottom panel to view API logs, latency, and token usage

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles & CSS variables
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main workbench page
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── utils.ts         # Utility functions
│   └── mock-data.ts     # Sample data & mock responses
└── prompts/
    └── structured_json_extract.txt  # AI extraction prompt schema
```

## Mock Mode

The application runs in mock mode by default, simulating:
- Network latency (800-2000ms)
- Token counting (estimated)
- 10% error rate for testing error states

## License

Proprietary - Hüner AI

