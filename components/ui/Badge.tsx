import { cn } from '@/lib/utils'

type BadgeColor = 'green' | 'amber' | 'red' | 'gray' | 'blue'

const colorMap: Record<BadgeColor, string> = {
  green: 'bg-green-50 text-green-700 border-green-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
}

interface BadgeProps {
  label: string
  color: BadgeColor
  className?: string
}

export default function Badge({ label, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        colorMap[color],
        className
      )}
    >
      {label}
    </span>
  )
}
