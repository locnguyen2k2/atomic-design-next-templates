import { 
  faBuilding, 
  faFolderOpen, 
  faFlag, 
  faShieldHalved,
  faUsers,
  faKey,
  faPlus,
  faPen,
  faTrash,
  faEye,
  faCopy,
  faSearch,
  faArrowsRotate,
  faChevronLeft,
  faChevronRight,
  faMoon,
  faSun,
  faBars,
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
  faCircleInfo,
  faArrowTrendUp,
  faClockRotateLeft,
  faMobile,
  faLaptop,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@/types/icon';
import { cn } from '@/lib/utils';

const iconMap: Record<IconName, any> = {
  'building': faBuilding,
  'folder-open': faFolderOpen,
  'flag': faFlag,
  'shield': faShieldHalved,
  'users': faUsers,
  'key': faKey,
  'plus': faPlus,
  'pen': faPen,
  'trash': faTrash,
  'eye': faEye,
  'copy': faCopy,
  'search': faSearch,
  'refresh': faArrowsRotate,
  'chevron-left': faChevronLeft,
  'chevron-right': faChevronRight,
  'moon': faMoon,
  'sun': faSun,
  'menu': faBars,
  'check': faCircleCheck,
  'xmark': faCircleXmark,
  'warning': faTriangleExclamation,
  'info': faCircleInfo,
  'trend-up': faArrowTrendUp,
  'history': faClockRotateLeft,
  'mobile': faMobile,
  'laptop': faLaptop,
  'arrow-right-from-bracket': faArrowRightFromBracket,
};

interface IconProps {
  name: IconName;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Icon({ name, className, size = 'md' }: IconProps) {
  const sizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  return (
    <FontAwesomeIcon 
      icon={iconMap[name]} 
      className={cn(sizeClass, className)} 
    />
  );
}
