import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {
  ProjectFeature,
  ProjectMetric,
  ProjectShowcaseProps,
} from "./types";

const safeItems = <T,>(items: T[] | undefined, fallback: T[]): T[] =>
  Array.isArray(items) && items.length > 0 ? items : fallback;

const MetricCard: React.FC<{
  metric: ProjectMetric;
  index: number;
  accent: string;
}> = ({ metric, index, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({
    frame: frame - 24 - index * 6,
    fps,
    config: { damping: 18, stiffness: 140 },
  });

  return (
    <div
      className="rounded-3xl border border-white/10 bg-white/[0.08] px-6 py-5 shadow-2xl backdrop-blur"
      style={{
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px) scale(${interpolate(
          entrance,
          [0, 1],
          [0.92, 1],
        )})`,
      }}
    >
      <div
        className="text-4xl font-black tracking-tight"
        style={{ color: accent }}
      >
        {metric.value}
      </div>
      <div className="mt-2 text-sm uppercase tracking-[0.22em] text-white/60">
        {metric.label}
      </div>
    </div>
  );
};

const FeatureRow: React.FC<{
  feature: ProjectFeature;
  index: number;
  color: string;
}> = ({ feature, index, color }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(
    frame,
    [70 + index * 12, 94 + index * 12],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  return (
    <div
      className="flex gap-4 rounded-3xl border border-white/10 bg-black/25 p-5"
      style={{
        opacity: reveal,
        transform: `translateX(${interpolate(reveal, [0, 1], [50, 0])}px)`,
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-black"
        style={{ backgroundColor: color }}
      >
        {index + 1}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{feature.title}</div>
        <div className="mt-1 text-lg leading-snug text-white/68">
          {feature.detail}
        </div>
      </div>
    </div>
  );
};

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const metrics = safeItems(props.metrics, []);
  const features = safeItems(props.features, []);
  const tags = safeItems(props.tags, []);
  const heroScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const float = Math.sin(frame / 18) * 12;
  const orbit = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: "extend",
  });
  const outro = interpolate(frame, [246, 285], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="overflow-hidden px-20 py-24 font-sans"
      style={{
        background: `radial-gradient(circle at 25% 20%, ${props.brand.primary}55, transparent 32%),
          radial-gradient(circle at 84% 12%, ${props.brand.secondary}44, transparent 34%),
          linear-gradient(145deg, ${props.brand.background}, #02040c 72%)`,
        color: props.brand.foreground,
      }}
    >
      <div
        className="absolute -left-32 top-16 h-96 w-96 rounded-full blur-3xl"
        style={{
          backgroundColor: props.brand.primary,
          opacity: 0.22,
          transform: `translateY(${float}px)`,
        }}
      />
      <div
        className="absolute -right-24 bottom-40 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          backgroundColor: props.brand.secondary,
          opacity: 0.16,
          transform: `translateY(${-float}px)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <Sequence>
          <div
            style={{
              opacity: interpolate(frame, [0, 24], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(heroScale, [0, 1], [70, 0])}px)`,
            }}
          >
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.08] px-5 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/70">
              Project Showcase
            </div>
            <h1 className="mt-9 max-w-[850px] text-[5.7rem] font-black leading-[0.9] tracking-normal">
              {props.title}
            </h1>
            <p className="mt-8 max-w-[760px] text-4xl font-semibold leading-tight text-white/82">
              {props.subtitle}
            </p>
          </div>
        </Sequence>

        <Sequence from={38}>
          <div className="relative h-[560px]">
            <div
              className="absolute left-2 top-20 h-[390px] w-[690px] rounded-[2.5rem] border border-white/12 bg-white/[0.07] p-7 shadow-2xl backdrop-blur"
              style={{
                transform: `perspective(1000px) rotateX(58deg) rotateZ(-24deg) translateY(${float}px)`,
              }}
            >
              <div className="h-full rounded-[2rem] bg-black/45 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-44 rounded-full bg-white/25" />
                    <div className="mt-4 h-3 w-28 rounded-full bg-white/12" />
                  </div>
                  <div
                    className="h-16 w-16 rounded-2xl"
                    style={{ backgroundColor: props.brand.accent }}
                  />
                </div>
                <div className="mt-10 grid grid-cols-3 gap-5">
                  {[0, 1, 2, 3, 4, 5].map((item) => (
                    <div
                      className="h-28 rounded-3xl border border-white/10 bg-white/[0.08]"
                      key={item}
                      style={{
                        opacity: interpolate(
                          frame,
                          [54 + item * 5, 78 + item * 5],
                          [0, 1],
                          {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                          },
                        ),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className="absolute right-4 top-0 h-[520px] w-[265px] rounded-[3.2rem] border-[10px] border-slate-950 bg-white p-4 shadow-2xl"
              style={{
                transform: `translateY(${float * 0.7}px) rotate(${interpolate(
                  frame,
                  [40, 130],
                  [7, -3],
                  { extrapolateRight: "clamp" },
                )}deg)`,
              }}
            >
              <div className="mx-auto mb-5 h-5 w-24 rounded-full bg-slate-950" />
              <div className="rounded-[2rem] bg-slate-100 p-4 text-slate-950">
                <div
                  className="mb-4 h-24 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${props.brand.primary}, ${props.brand.secondary})`,
                  }}
                />
                <div className="h-5 w-32 rounded-full bg-slate-300" />
                <div className="mt-3 h-4 w-40 rounded-full bg-slate-200" />
                <div className="mt-8 space-y-3">
                  {tags.slice(0, 4).map((tag) => (
                    <div
                      className="rounded-2xl bg-white px-4 py-3 text-base font-bold"
                      key={tag}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="absolute right-52 top-52 h-36 w-36 rounded-[2rem] shadow-2xl"
              style={{
                backgroundColor: props.brand.accent,
                transform: `rotate(${orbit}deg) translateY(${float * 0.4}px)`,
              }}
            />
          </div>
        </Sequence>

        <Sequence from={112}>
          <div className="grid grid-cols-3 gap-5">
            {metrics.slice(0, 3).map((metric, index) => (
              <MetricCard
                accent={props.brand.accent}
                index={index}
                key={metric.label}
                metric={metric}
              />
            ))}
          </div>
        </Sequence>

        <Sequence from={150}>
          <div className="grid gap-4">
            {features.slice(0, 3).map((feature, index) => (
              <FeatureRow
                color={props.brand.secondary}
                feature={feature}
                index={index}
                key={feature.title}
              />
            ))}
          </div>
        </Sequence>

        <div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{
            opacity: outro,
            background: `linear-gradient(145deg, ${props.brand.primary}, ${props.brand.background})`,
          }}
        >
          <div className="text-center">
            <div className="text-[5rem] font-black leading-none">
              {props.title}
            </div>
            <div className="mt-6 text-3xl font-semibold text-white/72">
              {props.description}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
