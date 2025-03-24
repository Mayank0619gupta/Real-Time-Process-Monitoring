
import { Activity, AlignLeft, Bell, Search, Settings } from 'lucide-react';
import { SystemInfo } from '../utils/mockData';
import { cn } from '@/lib/utils';

interface HeaderProps {
  systemInfo: SystemInfo;
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

const Header = ({ systemInfo, onSearchChange, searchTerm }: HeaderProps) => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between glassmorphism rounded-lg mb-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">Processes Monitor</h1>
        <div className="hidden md:flex items-center text-xs text-muted-foreground ml-2 border-l pl-3 border-muted">
          <span className="mr-2">{systemInfo.hostname}</span>
          <span className="mr-2">{systemInfo.platform}</span>
          <span>Uptime: {systemInfo.uptime}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "h-9 rounded-md pl-8 pr-3 focus-visible:ring-1 focus-visible:ring-offset-0",
              "text-sm bg-muted/50 border-0 focus-visible:ring-ring",
              "transition-all duration-200 w-[180px] focus-visible:w-[220px]"
            )}
          />
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-full hover:bg-muted/80 transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted/80 transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
