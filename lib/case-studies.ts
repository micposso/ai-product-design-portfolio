export type CaseStudy = {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  prompt: string;
  summary: string;
  challenge: string;
  outcome: string;
};

export const caseStudies: Array<CaseStudy> = [
  {
    slug: "ai-assistants",
    eyebrow: "AI Assistants",
    title: "Voice copilots and productized AI assistants",
    subtitle: "Voice, agent flows, productized copilots",
    image: "/images/portfolio-reachy.png",
    prompt: "Tell me about the AI assistants you have built.",
    summary:
      "Placeholder copy for an AI assistant case study. Use this space to describe the product vision, the user problem, and how the assistant fit into the overall business workflow.",
    challenge:
      "Placeholder challenge section describing fragmented workflows, unclear ownership, and the need to turn a promising prototype into a reliable experience that people could trust.",
    outcome:
      "Placeholder outcome section showing the impact, adoption, or speed improvements that came from shipping the assistant into a real production environment.",
  },
  {
    slug: "product-systems",
    eyebrow: "Product Systems",
    title: "Designing and shipping polished product systems",
    subtitle: "Shipping polished experiences from concept to launch",
    image: "/images/portfolio-icons.png",
    prompt: "What product systems have you built lately?",
    summary:
      "Placeholder copy for a product systems case study. This area can explain the design system, the frontend architecture, and the product thinking behind the implementation.",
    challenge:
      "Placeholder challenge section covering scale, consistency, and the complexity of unifying design, product, and engineering decisions across multiple surfaces.",
    outcome:
      "Placeholder outcome section highlighting a faster shipping cadence, more coherent UX, and a stronger foundation for future product work.",
  },
  {
    slug: "delivery-work",
    eyebrow: "Delivery Work",
    title: "Recent builds, launches, and execution velocity",
    subtitle: "Recent builds, launches, and execution velocity",
    image: "/images/portfolio-green.jpg",
    prompt: "What have you built lately?",
    summary:
      "Placeholder copy for a delivery-focused case study. Use this section to talk through how ideas moved from brief to prototype to production launch.",
    challenge:
      "Placeholder challenge section showing the need to balance speed, ambiguity, and technical quality while keeping stakeholders aligned.",
    outcome:
      "Placeholder outcome section describing product launches, measurable traction, and the operational discipline that made those releases possible.",
  },
  {
    slug: "agent-workflows",
    eyebrow: "Agent Workflows",
    title: "Operational AI systems and multi-step agent flows",
    subtitle: "Automations, orchestration, and operational AI systems",
    image: "/images/portfolio-reachy.png",
    prompt: "Tell me about the agent workflows you have built.",
    summary:
      "Placeholder copy for an agent workflows case study. Describe how multiple services, tools, and prompts were orchestrated into a coherent workflow.",
    challenge:
      "Placeholder challenge section discussing reliability, latency, tool coordination, and the need for strong UX around complex automation.",
    outcome:
      "Placeholder outcome section focused on efficiency gains, reduced manual work, and improved confidence in AI-assisted operations.",
  },
  {
    slug: "design-engineering",
    eyebrow: "Design Engineering",
    title: "Interfaces that feel polished, fast, and intentional",
    subtitle: "Interfaces that feel polished, fast, and intentional",
    image: "/images/portfolio-icons.png",
    prompt: "How do you approach design engineering work?",
    summary:
      "Placeholder copy for a design engineering case study. This can speak to visual systems, interaction quality, and how craft supports product strategy.",
    challenge:
      "Placeholder challenge section around avoiding generic UI, aligning visual identity with business goals, and keeping implementation quality high.",
    outcome:
      "Placeholder outcome section describing stronger perceived quality, more confidence in the product, and a more distinctive experience overall.",
  },
  {
    slug: "launch-strategy",
    eyebrow: "Launch Strategy",
    title: "Taking products from prototype to launch",
    subtitle: "Turning prototypes into products people can actually use",
    image: "/images/portfolio-green.jpg",
    prompt: "How do you take products from prototype to launch?",
    summary:
      "Placeholder copy for a launch strategy case study. Explain how the work was scoped, validated, and turned into something ready for real users.",
    challenge:
      "Placeholder challenge section covering roadmap pressure, shifting requirements, and the need to prioritize what mattered most for launch.",
    outcome:
      "Placeholder outcome section describing launch readiness, smoother handoff, and a clearer path from experimentation to product growth.",
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
