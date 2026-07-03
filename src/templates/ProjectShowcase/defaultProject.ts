import type { ProjectShowcaseProps } from "./types";

export const defaultProject: ProjectShowcaseProps = {
  slug: "iluy",
  title: "Iluy.ai",
  subtitle: "Multi-model AI chatbot platform",
  description:
    "Animated portfolio card for an AI product with research, agent, and performance signals.",
  brand: {
    primary: "#6d5dfc",
    secondary: "#19d3da",
    accent: "#f8d84a",
    background: "#070818",
    foreground: "#f8fbff",
  },
  metrics: [
    { label: "Users", value: "5k+" },
    { label: "Match accuracy", value: "90%" },
    { label: "Cloud cost", value: "<$100/mo" },
  ],
  features: [
    {
      title: "Research agent",
      detail: "Deep-search workflow with multi-step answer synthesis.",
    },
    {
      title: "Multi-model chat",
      detail: "LLM routing interface for fast, contextual responses.",
    },
    {
      title: "Serverless scale",
      detail: "Lean architecture designed for low operating cost.",
    },
  ],
  tags: ["Next.js", "NestJS", "LangChain", "Vercel AI SDK"],
};
