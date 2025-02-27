import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
                blue: "border-transparent bg-blue-600 text-zinc-50 hover:bg-blue-600/80 dark:bg-blue-900 dark:text-zinc-50 dark:hover:bg-blue-900/80",
                rose: "border-transparent bg-rose-600 text-zinc-50 hover:bg-rose-600/80 dark:bg-rose-900 dark:text-zinc-50 dark:hover:bg-rose-900/80",
                emerald: "border-transparent bg-emerald-600 text-zinc-50 hover:bg-emerald-600/80 dark:bg-emerald-900 dark:text-zinc-50 dark:hover:bg-emerald-900/80",
                amber: "border-transparent bg-amber-600 text-zinc-50 hover:bg-amber-600/80 dark:bg-amber-900 dark:text-zinc-50 dark:hover:bg-amber-900/80",
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
