
import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';
import { ResourceUsage } from '../utils/mockData';
import { cn } from '@/lib/utils';

interface ResourceMonitorProps {
  resources: ResourceUsage;
}

const ResourceMonitor = ({ resources }: ResourceMonitorProps) => {
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} MB`;
    return `${(bytes / 1024).toFixed(2)} GB`;
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage < 50) return 'text-green-500';
    if (percentage < 80) return 'text-amber-500';
    return 'text-red-500';
  };

  const coreGridCols = resources.cpu.cores.length <= 4 ? 'grid-cols-4' : 'grid-cols-8';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up animate-delay-100">
      {/* CPU Usage */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">CPU Usage</h3>
          </div>
          <span className={cn("text-xl font-semibold", getUsageColor(resources.cpu.total))}>
            {resources.cpu.total}%
          </span>
        </div>
        
        <div className="h-2 bg-muted rounded-full mb-4">
          <div 
            className={cn("h-2 rounded-full transition-all duration-500 ease-out", 
              resources.cpu.total < 50 ? "bg-blue-500" : 
              resources.cpu.total < 80 ? "bg-amber-500" : 
              "bg-red-500"
            )}
            style={{ width: `${resources.cpu.total}%` }}
          ></div>
        </div>
        
        <div className={cn("grid gap-2", coreGridCols)}>
          {resources.cpu.cores.map((usage, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="h-8 w-full bg-muted rounded relative">
                <div 
                  className={cn("absolute bottom-0 w-full transition-all duration-500 ease-out rounded", 
                    usage < 50 ? "bg-blue-500/40" : usage < 80 ? "bg-amber-500/40" : "bg-red-500/40"
                  )}
                  style={{ height: `${usage}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground mt-1">C{index}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Usage */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <MemoryStick className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">Memory Usage</h3>
          </div>
          <span className={cn("text-xl font-semibold", getUsageColor(resources.memory.percentage))}>
            {resources.memory.percentage}%
          </span>
        </div>
        
        <div className="h-2 bg-muted rounded-full mb-4">
          <div 
            className={cn("h-2 rounded-full transition-all duration-500 ease-out", 
              resources.memory.percentage < 50 ? "bg-purple-500" : 
              resources.memory.percentage < 80 ? "bg-amber-500" : 
              "bg-red-500"
            )}
            style={{ width: `${resources.memory.percentage}%` }}
          ></div>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">{formatBytes(resources.memory.used)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">{formatBytes(resources.memory.total)}</span>
          </div>
        </div>
      </div>

      {/* Disk I/O */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-emerald-500" />
            <h3 className="font-medium">Disk I/O</h3>
          </div>
          <span className={cn("text-xl font-semibold", getUsageColor(resources.disk.usage))}>
            {resources.disk.usage}%
          </span>
        </div>
        
        <div className="h-2 bg-muted rounded-full mb-4">
          <div 
            className={cn("h-2 rounded-full transition-all duration-500 ease-out", 
              resources.disk.usage < 50 ? "bg-emerald-500" : 
              resources.disk.usage < 80 ? "bg-amber-500" : 
              "bg-red-500"
            )}
            style={{ width: `${resources.disk.usage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-4">
          <div className="text-center flex-1">
            <div className="text-xs text-muted-foreground mb-1">Read</div>
            <div className="text-lg font-medium">{resources.disk.read} <span className="text-xs text-muted-foreground">MB/s</span></div>
          </div>
          <div className="border-l border-muted"></div>
          <div className="text-center flex-1">
            <div className="text-xs text-muted-foreground mb-1">Write</div>
            <div className="text-lg font-medium">{resources.disk.write} <span className="text-xs text-muted-foreground">MB/s</span></div>
          </div>
        </div>
      </div>

      {/* Network */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <div className="flex items-center space-x-2 mb-4">
          <Network className="h-5 w-5 text-cyan-500" />
          <h3 className="font-medium">Network</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Download</span>
              <span className="font-medium">{resources.network?.download} MB/s</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-2 bg-cyan-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(resources.network?.download || 0) * 10}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Upload</span>
              <span className="font-medium">{resources.network?.upload} MB/s</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-2 bg-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(resources.network?.upload || 0) * 20}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceMonitor;
