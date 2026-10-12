import { google } from '@ai-sdk/google';
import { createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai';

export const maxDuration = 30;

const resumeContext = `
Ali Nawaf is a Computer Science and Mathematics student at Case Western Reserve University (expected May 2027).
He is passionate about creating innovative solutions and building impactful software applications.

Experience:
- Machine Learning Research Assistant at Houston Methodist Hospital (Aug 2023 – Present): Achieved >90% accuracy in cardiovascular risk prediction using ResNet-based CNN on CT scans. Engineered a signal processing pipeline for 10,000+ ECG patient records.
- Researcher at UWC Science Collective (July 2025 – Present): Implemented VAEs in PyTorch for a Cornell PhD-led lab.
- Research Assistant at Case Western Reserve University (Aug 2025 – Present): Working on a $1.2M NIH-funded privacy-preserving genomic data project with Prof. Erman Ayday.
- Software Engineer at Eaton (Jan 2025 – May 2025): Engineered Azure data pipeline processing 100k+ Salesforce records monthly, cutting latency by 35%.
- Machine Learning Intern at Heads-up Hockey (Dec 2024 – Aug 2025): Built Swift iOS app with Core-ML achieving real-time inference; reduced model size 50% with quantization; improved user retention 63%.
- IT Intern at EarthLink ISP (May 2024 – Aug 2024): Built Java-based network monitoring system, automated ticket classification with Python.

Education:
- BS in Computer Science, Secondary Major: Mathematics – Case Western Reserve University (May 2027)
- MS in Machine Learning and Artificial Intelligence – Case Western Reserve University (May 2027)

Key Projects:
- Medical Smart Labeler: Reduced annotation time 60% using Label-Studio API + YOLOv10 fine-tuning.
- ElectroVector App: iOS app converting ECG signals into vectorcardiograms with clinical metrics.
- Hockey Analytics ML: Computer vision models with 3× accuracy gains, real-time inference.
- Generative ECG Models: VAE in PyTorch to learn latent ECG representations for synthetic data augmentation.
- AliJR: Real-time RAG-enabled AI voice clone built with LiveKit and Google Gemini.

Skills: C, CUDA, Python, Java, Swift, SQL, JavaScript, React, Next.js, PyTorch, TensorFlow, Scikit-learn, Azure, AWS, Docker, Kubernetes, HPC/SLURM.
Contact: aan90@case.edu | +1 (216) 647-4302 | LinkedIn: linkedin.com/in/alinawaf | GitHub: github.com/Ali6x1000
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Convert UIMessage parts format to simple content strings for the model
  const modelMessages = messages.map((m: any) => ({
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.parts
      ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
      : (m.content ?? ''),
  }));

  const stream = streamText({
    model: google('gemini-1.5-pro-latest'),
    messages: modelMessages,
    system: `You are AliJR, Ali Nawaf's personal AI assistant embedded on his portfolio website.
Your job is to answer questions from recruiters and visitors about Ali's background, skills, projects, and experience.
Be warm, professional, and concise. Only use the information below — do not invent details.

${resumeContext}

If asked something you don't know, say: "I don't have that information, but you can reach Ali directly at aan90@case.edu."
`,
  });

  return stream.toUIMessageStreamResponse();
}
