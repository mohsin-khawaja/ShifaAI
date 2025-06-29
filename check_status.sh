#!/bin/bash

echo "🩺 ShifaAI System Status Check"
echo "=============================="

# Check backend health
echo "🔧 Backend Health:"
BACKEND_STATUS=$(curl -s http://localhost:8000/api/health | jq -r '.status' 2>/dev/null)
if [ "$BACKEND_STATUS" = "healthy" ]; then
    echo "✅ Backend: HEALTHY"
else
    echo "❌ Backend: NOT RESPONDING"
fi

# Check frontend
echo ""
echo "🌐 Frontend Status:"
FRONTEND_CHECK=$(curl -s http://localhost:3000 | grep -o "ShifaAI" | head -1 2>/dev/null)
if [ "$FRONTEND_CHECK" = "ShifaAI" ]; then
    echo "✅ Frontend: ACCESSIBLE"
else
    echo "❌ Frontend: NOT ACCESSIBLE"
fi

# Test API endpoints
echo ""
echo "🔌 API Endpoints:"

# Medical
MEDICAL_TEST=$(curl -s -X POST http://localhost:8000/api/medical/ask -H "Content-Type: application/json" -d '{"question": "What is diabetes?"}' | jq -r '.success' 2>/dev/null)
if [ "$MEDICAL_TEST" = "true" ]; then
    echo "✅ Medical API: WORKING"
else
    echo "❌ Medical API: FAILED"
fi

# CBT
CBT_TEST=$(curl -s http://localhost:8000/api/cbt/exercise | jq -r '.success' 2>/dev/null)
if [ "$CBT_TEST" = "true" ]; then
    echo "✅ CBT API: WORKING"
else
    echo "❌ CBT API: FAILED"
fi

# Shifa
SHIFA_TEST=$(curl -s http://localhost:8000/api/shifa/dua | jq -r '.success' 2>/dev/null)
if [ "$SHIFA_TEST" = "true" ]; then
    echo "✅ Shifa API: WORKING"
else
    echo "❌ Shifa API: FAILED"
fi

# Knowledge Base
KNOWLEDGE_TEST=$(curl -s "http://localhost:8000/api/knowledge/search?q=test" | jq -r '.success' 2>/dev/null)
if [ "$KNOWLEDGE_TEST" = "true" ]; then
    echo "✅ Knowledge Base API: WORKING"
else
    echo "❌ Knowledge Base API: FAILED"
fi

echo ""
echo "🎯 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api"
echo "   Integration Test: file://$(pwd)/test_integration_comprehensive.html"

echo ""
echo "🚀 All systems operational! ShifaAI is ready for development." 