# 📖 Node.js Bot Training API

This is a **Node.js + Express** backend for managing bots, training them on **Q&A pairs**, **websites**, and **PDFs**, and chatting with them using **OpenAI embeddings**.  
All data is stored in local **JSON files** (`/data` folder).

---

## 🚀 Features
- Add and list bots
- Train bots with:
  - **Q&A pairs**
  - **Websites** (scraped, chunked, embedded)
  - **PDF files** (uploaded, extracted, embedded)
- Chat with trained bots using **retrieval + OpenAI chat model**
- JSON-based persistence (no external DB required)

---

## 📦 Tech Stack
- **Node.js** (v22+)
- **Express.js**
- **Multer** (for file uploads)
- **Cheerio** (for website scraping)
- **OpenAI SDK** (embeddings + chat)
- **dotenv** (for environment variables)

---

## ⚙️ Setup

1. Clone the repo & install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   PORT=3001
   ```

3. Start the server:
   ```bash
   node server.js
   ```
   Or with hot reload:
   ```bash
   npx nodemon server.js
   ```

---

## 📂 Project Structure
```
nodejs/
├── server.js                 # Main Express server
├── data/
│   ├── bots.json             # Stores bot info
│   ├── websites.json         # Stores website embeddings
│   ├── pdfs.json             # Stores PDF embeddings
│   └── qa.json               # Stores Q&A embeddings
└── lib/services/
    ├── botService.js         # Add/list bots
    ├── qa.js                 # Save Q&A data
    ├── websiteService.js     # Scrape & embed websites
    ├── pdf.js                # Upload & embed PDFs
    ├── chatService.js        # Chat with trained bots
    └── embedding.js          # Create embeddings (OpenAI)
```

---

## 📡 API Endpoints

### 🤖 Bot Management
- **Create Bot**
  ```http
  POST /api/bots
  ```
  **Body:**
  ```json
  { "name": "My Bot", "type": "json" }
  ```

- **Get All Bots**
  ```http
  GET /api/bots
  ```

---

### ❓ Q&A Training
- **Add Q&A**
  ```http
  POST /api/qa
  ```
  **Body:**
  ```json
  { "botId": "12345", "question": "What is AI?", "answer": "AI is Artificial Intelligence." }
  ```

---

### 🌍 Website Training
- **Train Website**
  ```http
  POST /api/websites
  ```
  **Body:**
  ```json
  { "botId": "12345", "url": "https://example.com" }
  ```

- **Get Websites by Bot**
  ```http
  GET /api/websites?botId=12345
  ```

---

### 📑 PDF Training
- **Upload PDF**
  ```http
  POST /api/pdf
  ```
  **Form-data:**
  ```
  botId: 12345
  file: <upload your PDF>
  ```

---

### 💬 Chat
- **Chat with a Bot**
  ```http
  POST /api/chat
  ```
  **Body:**
  ```json
  { "botId": "12345", "text": "Tell me about AI" }
  ```

  **Response:** (streamed text chunks)
  ```
  AI is the simulation of human intelligence in machines...
  ```

---

## ✅ Example Usage (Postman)

1. **Create a bot** → `POST /api/bots`  
2. **Train with Q&A** → `POST /api/qa`  
3. **Train with Website** → `POST /api/websites`  
4. **Train with PDF** → `POST /api/pdf`  
5. **Ask a question** → `POST /api/chat`
