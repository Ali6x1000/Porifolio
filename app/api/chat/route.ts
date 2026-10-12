import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Define some static resume data for the RAG component to use
  const resumeContext = `
    Ali Nawaf is a Computer Science and Mathematics student at Case Western Reserve University (expected May 2027).
    He is passionate about creating innovative solutions and building impactful software applications.
    
    Experience:
    - Machine Learning Research Assistant at Houston Methodist Hospital (Aug 2023 - Present): Achieved >90% accuracy in cardiovascular risk prediction using ResNet-based CNN on CT scans.
    - Software Engineer Intern at Eaton (Jan 2025 - May 2025): Engineered a data pipeline on Azure processing 100k+ records monthly.
    - Machine Learning Intern at Heads-up Hockey (Dec 2024 - Aug 2025): Implemented Swift iOS app with Core-ML, quantization, achieving real-time inference.
    - IT Intern at EarthLink ISP (May 2024 - Aug 2024): Built a Java-based monitoring system.
    
    Skills: C, CUDA, Python, Java, Swift, SQL, React, Next.js, PyTorch, TensorFlow, Azure, Docker, Kubernetes.
    Contact: aan90@case.edu | +1 (216) 647-4302
  `;

  // We use streamText from Vercel AI SDK to stream the response back
  const result = await streamText({
    model: google('gemini-1.5-pro-latest'), // Or gemini-2.5-pro when available in the SDK
    messages,
    system: `You are Ali Nawaf's personal AI assistant named AliJR. 
    Your goal is to answer questions about Ali's background, projects, and skills based on the provided tools.
    Be professional, concise, and helpful to recruiters or visitors.
    Do NOT invent information that is not provided by the tools.
    `,
    tools: {
      getResumeInfo: tool({
        description: 'Get information about Ali Nawaf\'s education, work experience, and skills.',
        parameters: z.object({
          topic: z.string().describe('The specific topic to look up (e.g., "experience", "education", "skills", "contact")'),
        }),
        execute: async ({ topic }) => {
          // In a real RAG system, this would query a vector database (Pinecone/Postgres)
          // For now, we return the static context which the LLM will use to answer.
          return {
            context: resumeContext,
            topic_requested: topic
          };
        },
      }),
      // Future Admin Tools (Require Authentication)
      /*
      syncGithubProjects: tool({
         description: 'Admin ONLY: Sync latest repositories from GitHub.',
         parameters: z.object({}),
         execute: async () => { ... }
      })
      */
    },
    // The AI SDK automatically determines if it needs to call a tool based on the user's prompt.
    // If it calls a tool, it gets the result and formulates a final response.
  });

  return result.toDataStreamResponse();
}

