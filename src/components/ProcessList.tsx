
import { ArrowDown, ArrowUp, Play, PauseCircle, XCircle } from 'lucide-react';
import { Process } from '../utils/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface ProcessListProps {
  processes: Process[];
  sortConfig: { key: keyof Process; direction: 'asc' | 'desc' };
  requestSort: (key: keyof Process) => void;
  killProcess: (pid: number) => void;
  suspendProcess: (pid: number) => void;
  resumeProcess: (pid: number) => void;
}

const ProcessList = ({ 
  processes, 
  sortConfig, 
  requestSort, 
  killProcess,
  suspendProcess,
  resumeProcess
}: ProcessListProps) => {
  const { toast } = useToast();

  const getSortIcon = (key: keyof Process) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-3 w-3 ml-1" /> : 
      <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const handleKillProcess = (pid: number, name: string) => {
    killProcess(pid);
    toast({
      title: "Process terminated",
      description: `Process ${name} (${pid}) has been terminated.`,
      variant: "default",
    });
  };

  const handleSuspendProcess = (pid: number, name: string) => {
    suspendProcess(pid);
    toast({
      title: "Process suspended",
      description: `Process ${name} (${pid}) has been suspended.`,
      variant: "default",
    });
  };

  const handleResumeProcess = (pid: number, name: string) => {
    resumeProcess(pid);
    toast({
      title: "Process resumed",
      description: `Process ${name} (${pid}) has been resumed.`,
      variant: "default",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'sleeping': return 'bg-blue-500';
      case 'stopped': return 'bg-amber-500';
      case 'zombie': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-[450px] overflow-auto rounded-lg glassmorphism p-1 animate-slide-up animate-delay-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground border-b">
            <th className="px-3 py-3 text-left font-medium">
              <button 
                onClick={() => requestSort('pid')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                PID {getSortIcon('pid')}
              </button>
            </th>
            <th className="px-3 py-3 text-left font-medium">
              <button 
                onClick={() => requestSort('name')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Process {getSortIcon('name')}
              </button>
            </th>
            <th className="px-3 py-3 text-left font-medium">
              <button 
                onClick={() => requestSort('cpu')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                CPU % {getSortIcon('cpu')}
              </button>
            </th>
            <th className="px-3 py-3 text-left font-medium">
              <button 
                onClick={() => requestSort('memory')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Memory (MB) {getSortIcon('memory')}
              </button>
            </th>
            <th className="px-3 py-3 text-left font-medium">
              <button 
                onClick={() => requestSort('user')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                User {getSortIcon('user')}
              </button>
            </th>
            <th className="px-3 py-3 text-left font-medium">
              <button 
                onClick={() => requestSort('status')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Status {getSortIcon('status')}
              </button>
            </th>
            <th className="px-3 py-3 text-left font-medium">
              <button 
                onClick={() => requestSort('priority')}
                className="flex items-center hover:text-foreground transition-colors"
              >
                Priority {getSortIcon('priority')}
              </button>
            </th>
            <th className="px-3 py-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr 
              key={process.pid} 
              className="border-b border-muted/30 hover:bg-muted/40 transition-colors"
            >
              <td className="px-3 py-2">{process.pid}</td>
              <td className="px-3 py-2 font-medium">{process.name}</td>
              <td className="px-3 py-2">
                <div className="flex items-center">
                  <div className="w-16 bg-muted rounded-full h-1.5 mr-2">
                    <div 
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${Math.min(process.cpu * 7, 100)}%` }}
                    ></div>
                  </div>
                  {process.cpu}%
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center">
                  <div className="w-16 bg-muted rounded-full h-1.5 mr-2">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(process.memory / 10, 100)}%` }}
                    ></div>
                  </div>
                  {process.memory}
                </div>
              </td>
              <td className="px-3 py-2">{process.user}</td>
              <td className="px-3 py-2">
                <div className="flex items-center">
                  <div className={cn("h-2 w-2 rounded-full mr-2", getStatusColor(process.status))}></div>
                  <span className="capitalize">{process.status}</span>
                </div>
              </td>
              <td className="px-3 py-2">{process.priority}</td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-center space-x-1">
                  {process.status === 'running' ? (
                    <button 
                      onClick={() => handleSuspendProcess(process.pid, process.name)}
                      className="p-1 rounded-full hover:bg-muted/80 transition-colors"
                      title="Suspend"
                    >
                      <PauseCircle className="h-4 w-4 text-amber-500" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleResumeProcess(process.pid, process.name)}
                      className="p-1 rounded-full hover:bg-muted/80 transition-colors"
                      title="Resume"
                      disabled={process.status === 'zombie'}
                    >
                      <Play className="h-4 w-4 text-green-500" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleKillProcess(process.pid, process.name)}
                    className="p-1 rounded-full hover:bg-muted/80 transition-colors"
                    title="Terminate"
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessList;
