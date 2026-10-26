import React from 'react';
import {
  Utensils,
  Coffee,
  GraduationCap,
  Bike,
  Home,
  ShoppingBag,
  Gamepad2,
  Sparkles,
  Gift,
  HelpCircle,
  HeartHandshake,
  Briefcase,
  Award,
  Coins,
  Laptop,
  Palmtree,
  ShieldCheck,
  Plane,
  Smartphone,
  Heart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { CategoryId } from '../../types';
import { getCategoryById } from '../../data/categories';

const ICON_MAP: Record<string, React.ElementType> = {
  Utensils,
  Coffee,
  GraduationCap,
  Bike,
  Home,
  ShoppingBag,
  Gamepad2,
  Sparkles,
  Gift,
  HelpCircle,
  HeartHandshake,
  Briefcase,
  Award,
  Coins,
  Laptop,
  Palmtree,
  ShieldCheck,
  Plane,
  Smartphone,
  Heart,
  TrendingDown,
  TrendingUp,
};

interface CategoryIconProps {
  categoryId?: CategoryId | string;
  iconName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBg?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryId,
  iconName,
  size = 'md',
  className = '',
  showBg = true,
}) => {
  const category = categoryId ? getCategoryById(categoryId) : null;
  const resolvedIconName = iconName || category?.icon || 'HelpCircle';
  const IconComponent = ICON_MAP[resolvedIconName] || HelpCircle;

  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const iconSizeStyles = {
    sm: 14,
    md: 19,
    lg: 24,
  };

  const color = category?.color || '#52769A';
  const bgColor = category?.bgColor || '#EAF3FA';

  if (!showBg) {
    return <IconComponent size={iconSizeStyles[size]} style={{ color }} className={className} />;
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl flex-shrink-0 transition-transform hover:scale-105 ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: bgColor,
        color: color,
        boxShadow: `0 3px 8px -1px ${color}20`,
      }}
    >
      <IconComponent size={iconSizeStyles[size]} strokeWidth={2.2} />
    </div>
  );
};
