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
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
  faCircleInfo,
  faArrowTrendUp,
  faClockRotateLeft,
  faMobile,
  faLaptop,
  faArrowRightFromBracket,
  faGrip,
  faCircleUser,
  faGear,
  faXmark,
  faChevronDown,
  faAt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@/types/icon';
import { cn } from '@/lib/utils';

const iconMap: Record<IconName, any> = {
  'building': faBuilding,
  'folder-open': faFolderOpen,
  'flag': faFlag,
  'shield': faShieldHalved,
  'shield-halved': faShieldHalved,
  'users': faUsers,
  'key': faKey,
  'plus': faPlus,
  'pen': faPen,
  'trash': faTrash,
  'eye': faEye,
  'copy': faCopy,
  'search': faSearch,
  'refresh': faArrowsRotate,
  'arrows-rotate': faArrowsRotate,
  'chevron-left': faChevronLeft,
  'chevron-right': faChevronRight,
  'moon': faMoon,
  'sun': faSun,
  'menu': faBars,
  'check': faCheck,
  'circle-check': faCircleCheck,
  'xmark': faXmark,
  'circle-xmark': faCircleXmark,
  'warning': faTriangleExclamation,
  'triangle-exclamation': faTriangleExclamation,
  'info': faCircleInfo,
  'circle-info': faCircleInfo,
  'trend-up': faArrowTrendUp,
  'history': faClockRotateLeft,
  'mobile': faMobile,
  'laptop': faLaptop,
  'arrow-right-from-bracket': faArrowRightFromBracket,
  'grid-2': faGrip,
  'user': faCircleUser,
  'settings': faGear,
  'x': faXmark,
  'chevron-down': faChevronDown,
  'at': faAt,
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
