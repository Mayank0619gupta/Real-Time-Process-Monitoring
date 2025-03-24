
import { useState, useEffect } from 'react';

// Types
export interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user: string;
  status: 'running' | 'sleeping' | 'stopped' | 'zombie';
  priority: number;
  executionTime: string;
}

export interface ResourceUsage {
  cpu: {
    total: number;
    cores: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    read: number;
    write: number;
    usage: number;
  };
  network?: {
    download: number;
    upload: number;
  };
}

export interface SystemInfo {
  hostname: string;
  platform: string;
  uptime: string;
  cpuModel: string;
  cpuCores: number;
  memoryTotal: string;
}

// Generate random process data
const generateProcesses = (count: number): Process[] => {
  const statuses: ('running' | 'sleeping' | 'stopped' | 'zombie')[] = ['running', 'sleeping', 'stopped', 'zombie'];
  const users = ['root', 'admin', 'system', 'user'];
  const processNames = [
    'chrome', 'firefox', 'safari', 'edge', 
    'vscode', 'terminal', 'finder', 'explorer',
    'spotify', 'slack', 'discord', 'zoom',
    'systemd', 'kernel', 'sshd', 'nginx',
    'python', 'node', 'java', 'docker'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    pid: i + 1000,
    name: processNames[Math.floor(Math.random() * processNames.length)],
    cpu: parseFloat((Math.random() * 15).toFixed(1)),
    memory: parseFloat((Math.random() * 500).toFixed(0)),
    user: users[Math.floor(Math.random() * users.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: Math.floor(Math.random() * 20),
    executionTime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`
  }));
};

// Generate resource usage data
const generateResourceUsage = (): ResourceUsage => {
  const cpuCores = 8;
  const coreUsage = Array.from({ length: cpuCores }, () => parseFloat((Math.random() * 100).toFixed(1)));
  const totalCpuUsage = parseFloat((coreUsage.reduce((a, b) => a + b, 0) / cpuCores).toFixed(1));
  
  const memoryTotal = 16 * 1024; // 16GB in MB
  const memoryUsed = Math.floor(Math.random() * memoryTotal);
  const memoryPercentage = parseFloat(((memoryUsed / memoryTotal) * 100).toFixed(1));
  
  return {
    cpu: {
      total: totalCpuUsage,
      cores: coreUsage
    },
    memory: {
      used: memoryUsed,
      total: memoryTotal,
      percentage: memoryPercentage
    },
    disk: {
      read: parseFloat((Math.random() * 100).toFixed(1)),
      write: parseFloat((Math.random() * 80).toFixed(1)),
      usage: parseFloat((Math.random() * 85).toFixed(1))
    },
    network: {
      download: parseFloat((Math.random() * 10).toFixed(1)),
      upload: parseFloat((Math.random() * 5).toFixed(1))
    }
  };
};

// System information
const systemInfo: SystemInfo = {
  hostname: 'system-monitor',
  platform: 'Darwin',
  uptime: '5d 12h 34m',
  cpuModel: 'Intel Core i9-12900K',
  cpuCores: 8,
  memoryTotal: '16 GB'
};

// Hooks for data
export const useProcessData = () => {
  const [processes, setProcesses] = useState<Process[]>(generateProcesses(20));
  const [sortConfig, setSortConfig] = useState<{key: keyof Process, direction: 'asc' | 'desc'}>({
    key: 'cpu',
    direction: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Update processes randomly every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProcesses(prevProcesses => 
        prevProcesses.map(process => ({
          ...process,
          cpu: parseFloat((Math.random() * 15).toFixed(1)),
          memory: parseFloat((Math.random() * 500).toFixed(0)),
          status: Math.random() > 0.9 ? 
            (process.status === 'running' ? 'sleeping' : 'running') : 
            process.status
        }))
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Sort processes
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter processes
  const filteredProcesses = sortedProcesses.filter(process => 
    process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.pid.toString().includes(searchTerm)
  );

  const requestSort = (key: keyof Process) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return { 
    processes: filteredProcesses,
    sortConfig,
    searchTerm,
    setSearchTerm,
    requestSort,
    killProcess: (pid: number) => {
      setProcesses(processes.filter(p => p.pid !== pid));
    },
    suspendProcess: (pid: number) => {
      setProcesses(processes.map(p => 
        p.pid === pid ? { ...p, status: 'stopped' } : p
      ));
    },
    resumeProcess: (pid: number) => {
      setProcesses(processes.map(p => 
        p.pid === pid ? { ...p, status: 'running' } : p
      ));
    }
  };
};

export const useResourceData = () => {
  const [resources, setResources] = useState<ResourceUsage>(generateResourceUsage());
  const [history, setHistory] = useState<{
    cpu: number[],
    memory: number[],
    disk: {read: number[], write: number[]},
    time: string[]
  }>({
    cpu: Array(30).fill(0),
    memory: Array(30).fill(0),
    disk: {read: Array(30).fill(0), write: Array(30).fill(0)},
    time: Array(30).fill('')
  });

  // Update resources every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newResources = generateResourceUsage();
      setResources(newResources);
      
      // Update history
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setHistory(prev => ({
        cpu: [...prev.cpu.slice(1), newResources.cpu.total],
        memory: [...prev.memory.slice(1), newResources.memory.percentage],
        disk: {
          read: [...prev.disk.read.slice(1), newResources.disk.read],
          write: [...prev.disk.write.slice(1), newResources.disk.write]
        },
        time: [...prev.time.slice(1), timeString]
      }));
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return { resources, history };
};

export const useSystemInfo = () => {
  return { systemInfo };
};
