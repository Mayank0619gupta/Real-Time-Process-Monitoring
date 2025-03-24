
import { Line, Bar, AreaChart, Area, LineChart, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartProps {
  data: {
    cpu: number[];
    memory: number[];
    disk: {
      read: number[];
      write: number[];
    };
    time: string[];
  };
}

const Charts = ({ data }: ChartProps) => {
  // Format the data for recharts
  const cpuData = data.time.map((time, index) => ({
    time,
    value: data.cpu[index]
  }));

  const memoryData = data.time.map((time, index) => ({
    time,
    value: data.memory[index]
  }));

  const diskData = data.time.map((time, index) => ({
    time,
    read: data.disk.read[index],
    write: data.disk.write[index]
  }));

  // Get top CPU usage processes (this would come from actual data in a real app)
  const topProcesses = [
    { name: 'chrome', value: 12.5 },
    { name: 'firefox', value: 8.3 },
    { name: 'vscode', value: 6.7 },
    { name: 'node', value: 5.2 },
    { name: 'spotify', value: 4.1 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 p-2 border border-border rounded shadow-lg text-sm">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-slide-up animate-delay-300">
      {/* CPU Usage Over Time */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <h3 className="font-medium mb-4">CPU Usage Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={cpuData}
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="cpuColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.4} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'var(--muted-foreground)' }}
                tickFormatter={(value) => value.split(':')[2]} 
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="CPU"
                stroke="#3b82f6" 
                fill="url(#cpuColor)" 
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage Over Time */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <h3 className="font-medium mb-4">Memory Usage Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={memoryData}
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="memoryColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.4} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'var(--muted-foreground)' }}
                tickFormatter={(value) => value.split(':')[2]} 
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Memory"
                stroke="#a855f7" 
                fill="url(#memoryColor)" 
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disk I/O Activity */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <h3 className="font-medium mb-4">Disk I/O Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={diskData}
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.4} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'var(--muted-foreground)' }}
                tickFormatter={(value) => value.split(':')[2]} 
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)' }}
                tickFormatter={(value) => `${value} MB/s`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="read" 
                name="Read"
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="write" 
                name="Write"
                stroke="#f43f5e" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top CPU Usage Processes */}
      <div className="glassmorphism rounded-lg p-4 card-hover">
        <h3 className="font-medium mb-4">Top CPU Usage Processes</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProcesses}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.4} />
              <XAxis 
                type="number"
                tick={{ fill: 'var(--muted-foreground)' }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                dataKey="name"
                type="category"
                tick={{ fill: 'var(--muted-foreground)' }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                name="CPU Usage"
                fill="#0ea5e9" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
