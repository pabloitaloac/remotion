export type ProjectMetric = {
  label: string;
  value: string;
};

export type ProjectFeature = {
  title: string;
  detail: string;
};

export type ProjectShowcaseProps = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  metrics: ProjectMetric[];
  features: ProjectFeature[];
  tags: string[];
};
