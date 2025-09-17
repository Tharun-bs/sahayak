🌟 Sahayak – AI-Powered Teaching Assistant

Built for Google’s Agentic AI Day Hackathon 2025

📖 Overview

Sahayak is a web-based AI teaching assistant designed to empower educators in multi-grade, low-resource classrooms. In many schools, a single teacher manages multiple grades at once, making it challenging to prepare localized teaching materials, personalize learning, and address diverse student needs.

Sahayak leverages Google’s AI technologies to provide hyper-local content, differentiated worksheets, visual aids, and instant knowledge support — helping teachers save time while enhancing student learning outcomes.

🎯 Key Features

🌍 Hyper-Local Content Generation
Teachers can request lesson content in their local language, e.g., “Create a story in Marathi about farmers to explain soil types.”

📖 Differentiated Worksheets
Upload a textbook page → Gemini generates worksheets tailored to multiple grade levels.

❓ Instant Knowledge Base
Simple, accurate explanations for complex student questions with analogies in local languages.

🖼️ Visual Aid Generator
Generate line diagrams and charts (e.g., water cycle) that can be easily replicated on blackboards.

🎤 Voice Support (Future Scope)
Speech-to-text for teacher input and audio-based student assessments.

🛠️ Tech Stack

Frontend: React + TailwindCSS

Backend: Firebase Functions + Firestore

AI Services:

Gemini 1.5 Pro
 (multimodal content + worksheet generation)

Vertex AI Speech-to-Text
 (voice input)

Imagen
 (visual aid generation)

Deployment: Firebase Hosting / Firebase Studio

🔄 System Flow

Teacher logs in to the web app (Firebase Auth).

Selects tool: Content Generator | Worksheet Creator | Visual Aid | Knowledge Base.

Provides input (text, voice, or image).

Backend (Firebase Functions) routes the request to Gemini / Imagen / Vertex AI.

AI response is displayed and stored in Firebase (download/share enabled).
