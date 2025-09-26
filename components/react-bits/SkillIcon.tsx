import { cn } from '@/lib/utils';

interface SkillIconProps {
name: string;
icon: string;
className?: string;
}

const SkillIcon = ({ name, icon, className }: SkillIconProps) => {
return (
<div className={cn("group text-center", className)}>
<div className="skill-icon card-glass w-20 h-20 bg-gray-900 rounded-xl mx-auto mb-3 flex items-center justify-center cursor-pointer relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-portfolio-accent/30">
<div className="absolute inset-0 bg-gradient-to-br from-portfolio-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Icon */}
        <div className="relative z-10 text-3xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>

      <span className="text-portfolio-text text-white font-medium group-hover:text-portfolio-accent transition-colors duration-300">
        {name}
      </span>
    </div>

);
};

export default SkillIcon;
