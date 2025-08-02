

import { OpenAI } from "openai";
import dotenv from 'dotenv';
import prisma from "../config/prisma.js";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY || "",
    baseURL: "https://api.perplexity.ai",
});

export async function analyzeComplaint(req, res) {
    const complaintId = typeof req.params?.id === 'string'
        ? parseInt(req.params.id, 10)
        : NaN;

    if (isNaN(complaintId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid complaint ID format - must be a number"
        });
    }

    const complaint = await prisma.complaint.findUnique({
        where: {
            id: complaintId
        },
        select: {
            title: true,
            user: true,
            description: true,
            location: true,
            status: true,
            category: true,
            imageUrl: true,
        },
    });


    const prompt = `
        You are an expert municipal operations analyst. Analyze this citizen complaint:

        Title: "${complaint.title}"
        Description: "${complaint.description}"
        Type: "${complaint.category || 'Unknown'}"
        Location: "${complaint.location || 'Not specified'}"
        ${complaint.imageUrl ? `- Image available: Yes` : `- Image available: No`}

        Provide response in this exact JSON format:
        {
          "primary_category": "road_issue/sanitation/public_lighting/drainage/vegetation",
          "secondary_category": "e.g., pothole, garbage_overflow, broken_streetlight",
          "urgency": "low/medium/high/critical",
          "time_estimate": {
            "value": "number",
            "unit": "hours/days"
          },
          "resources": {
            "crew_size": "number",
            "equipment": ["list"],
            "difficulty": "1-5"
          },
          "safety_concerns": "text",
          "priority": "low/medium/high",
          "special_considerations": "text"
        }

        Guidelines:
        - For potholes: small (<1m)=2hrs, medium (1-2m)=4hrs, large (>2m)=1day
        - For garbage: single bag=1hr, pile=2hrs, overflow=4hrs
        - For lighting: bulb=1hr, wiring=4hrs, pole=1day
    `;

    const response = await openai.chat.completions.create({
        model: 'sonar-pro',
        messages: [
            {
                role: "system",
                content: "You are a municipal operations assistant. Respond with only valid JSON in the exact requested format."
            },
            { role: "user", content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.2
    });

    try {
        const content = response.choices[0].message.content;

        const jsonString = content.replace(/```json|```/g, '').trim();
        console.log(jsonString)
        return res.status(200).json({
            success: true,
            analyzeData: jsonString
        });

    } catch (e) {
        console.error("Failed to parse AI response:", e);
        console.log("Raw response:", response.choices[0].message.content);
        return res.status(500).json({
            success: false,
            message: 'Ai Analyze failed'
        });
    }
}


const testComplaint = {
    title: "Pothole near bus stop",
    description: "Large pothole on Main Street causing traffic delays.",
    type: "garbage",
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    location: "Main Street, near Bus Stop A",
};

// analyzeComplaint(testComplaint);