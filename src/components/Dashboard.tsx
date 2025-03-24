
import { useEffect, useState } from 'react';
import Header from './Header';
import ProcessList from './ProcessList';
import ResourceMonitor from './ResourceMonitor';
import SystemStats from './SystemStats';
import Charts from './Charts';
import { useProcessData, useResourceData, useSystemInfo } from '../utils/mockData';

const Dashboard = () => {
  const { processes, sortConfig, searchTerm, setSearchTerm, requestSort, killProcess, suspendProcess, resumeProcess } = useProcessData();
  const { resources, history } = useResourceData();
  const { systemInfo } = useSystemInfo();
  const [mounted, setMounted] = useState(false);

  // This effect ensures animations run properly on initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <Header 
          systemInfo={systemInfo} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <SystemStats systemInfo={systemInfo} />
        
        <ResourceMonitor resources={resources} />
        
        <Charts data={history} />
        
        <ProcessList 
          processes={processes}
          sortConfig={sortConfig}
          requestSort={requestSort}
          killProcess={killProcess}
          suspendProcess={suspendProcess}
          resumeProcess={resumeProcess}
        />
      </div>
    </div>
  );
};

export default Dashboard;
