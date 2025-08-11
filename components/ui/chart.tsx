'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const THEMES = { light: '', dark: '.dark' } as const;

// Dynamically import only the ResponsiveContainer component
const ResponsiveContainer = dynamic(
  () =>
    import('recharts').then(mod => {
      const Component = mod.ResponsiveContainer;
      return function Wrapper(props: React.ComponentProps<typeof Component>) {
        return <Component {...props} />;
      };
    }),
  { ssr: false }
);

// rest of your code unchanged...

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error('useChart must be used within a <ChartContainer />');
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const [chartId] = React.useState(() => `chart-${id || Math.random().toString(36).substring(2, 9)}`);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          'flex aspect-video justify-center text-xs',
          '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'Chart';

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config)
    .map(([key, item]) => {
      const color = item.theme
        ? Object.entries(item.theme)
            .map(
              ([theme, value]) =>
                `${THEMES[theme as keyof typeof THEMES]} [data-chart=${id}] [data-chart-color='${key}'] { --color-${key}: ${value}; }`
            )
            .join('\n')
        : `[data-chart=${id}] [data-chart-color='${key}'] { --color-${key}: ${item.color}; }`;

      return color;
    })
    .join('\n');

  return <style dangerouslySetInnerHTML={{ __html: colorConfig }} />;
}

function ChartTooltip({
  active,
  payload,
  label,
  hideLabel,
  labelFormatter,
  hideIndicator,
  indicator = 'dot',
  nameKey,
  labelKey,
}: any) {
  if (!active || !payload?.length) return null;
  const chart = useChart();

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm">
      {!hideLabel && <div className="mb-1 font-medium">{labelFormatter ? labelFormatter(label) : label}</div>}
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => {
          const key = (nameKey && entry.payload[nameKey]) || entry.dataKey;
          const configEntry = chart.config[key as string];
          return (
            <div key={`tooltip-item-${index}`} className="flex items-center gap-2 text-sm" data-chart-color={key}>
              {!hideIndicator &&
                (indicator === 'dot' ? (
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--color-${key})` }} />
                ) : (
                  <span className="h-2 w-3" style={{ backgroundColor: `var(--color-${key})` }} />
                ))}
              <span>{configEntry?.label || key}</span>
              <span className="ml-auto font-medium">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({ payload, verticalAlign = 'bottom', align = 'center', hideIcon = false }: any) {
  const chart = useChart();
  return (
    <div
      className={cn(
        'flex flex-wrap gap-2',
        verticalAlign === 'top' ? 'mb-2' : 'mt-2',
        align === 'left' && 'justify-start',
        align === 'right' && 'justify-end',
        align === 'center' && 'justify-center'
      )}
    >
      {payload.map((entry: any, index: number) => {
        const key = entry.dataKey;
        const configEntry = chart.config[key];
        return (
          <div key={`legend-item-${index}`} className="flex items-center gap-1 text-sm" data-chart-color={key}>
            {!hideIcon && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--color-${key})` }} />}
            {configEntry?.label || key}
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartLegend };
