import { Clock, Cpu, Server, MemoryStick } from 'lucide-react';
import { SystemInfo } from '../utils/mockData';

interface SystemStatsProps {
  systemInfo: SystemInfo;
}

const SystemStats = ({ systemInfo }: SystemStatsProps) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 mb-6 animate-slide-up">
      <div className="glassmorphism rounded-lg p-4 flex items-center space-x-4 flex-1 card-hover">
        <div className="p-3 bg-primary/10 rounded-full">
          <Server className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">System</div>
          <div className="font-medium">{systemInfo.platform}</div>
        </div>
      </div>
      
      <div className="glassmorphism rounded-lg p-4 flex items-center space-x-4 flex-1 card-hover">
        <div className="p-3 bg-purple-500/10 rounded-full">
          <Cpu className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">CPU</div>
          <div className="font-medium">{systemInfo.cpuModel}</div>
        </div>
      </div>
      
      <div className="glassmorphism rounded-lg p-4 flex items-center space-x-4 flex-1 card-hover">
        <div className="p-3 bg-blue-500/10 rounded-full">
          <MemoryStick className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Memory</div>
          <div className="font-medium">{systemInfo.memoryTotal}</div>
        </div>
      </div>
      
      <div className="glassmorphism rounded-lg p-4 flex items-center space-x-4 flex-1 card-hover">
        <div className="p-3 bg-cyan-500/10 rounded-full">
          <Clock className="h-5 w-5 text-cyan-500" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Uptime</div>
          <div className="font-medium">{systemInfo.uptime}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
