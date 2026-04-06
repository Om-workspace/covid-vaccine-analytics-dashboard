import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { ShieldCheck, Activity, Users, UserPlus } from 'lucide-react';
import './index.css';

const API_BASE = 'http://127.0.0.1:5000';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color, margin: '4px 0', fontSize: '14px' }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    let totalMilSecDur = parseInt(duration);
    let incrementTime = (totalMilSecDur / end) * 50000;

    let timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start > end) start = end;
      setCount(String(start));
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{parseInt(count).toLocaleString()}</span>;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    gender: null,
    latest: null,
    vaccines: null,
    topStates: [],
    doses: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genderRes, latestRes, vaccinesRes] = await Promise.all([
          axios.get(`${API_BASE}/gender`),
          axios.get(`${API_BASE}/latest`),
          axios.get(`${API_BASE}/vaccines`)
        ]);

        // Process Gender Data
        const genderData = [
          { name: 'Male', value: genderRes.data.male },
          { name: 'Female', value: genderRes.data.female }
        ];

        // Process Latest Data for Top States
        const statesData = latestRes.data.data;
        const sortedStates = [...statesData].sort((a, b) => b['Total Doses'] - a['Total Doses']);
        const topStates = sortedStates.slice(0, 10).map(s => ({
          name: s.State,
          Total: s['Total Doses']
        }));

        // First vs Second Dose
        const dosesData = sortedStates.slice(0, 15).map(s => ({
          name: s.State,
          First: s['First Dose'],
          Second: s['Second Dose']
        }));

        // Process Vaccines
        const vaccineMap = {};
        vaccinesRes.data.forEach(item => {
          if (!vaccineMap[item.Vaccine]) vaccineMap[item.Vaccine] = 0;
          vaccineMap[item.Vaccine] += item['Total Doses'];
        });
        const vaccinesAggregated = Object.keys(vaccineMap).map(k => ({
          name: k,
          value: vaccineMap[k]
        }));

        setData({
          gender: genderData,
          latest: latestRes.data,
          vaccines: vaccinesAggregated,
          topStates,
          doses: dosesData
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Dashboard Analytics...</p>
      </div>
    );
  }

  const totalDoses = data.latest?.data.reduce((acc, curr) => acc + curr['Total Doses'], 0) || 0;
  const firstDoses = data.latest?.data.reduce((acc, curr) => acc + curr['First Dose'], 0) || 0;
  const secondDoses = data.latest?.data.reduce((acc, curr) => acc + curr['Second Dose'], 0) || 0;

  return (
    <div className="dashboard-container">
      <header>
        <h1>COVID-19 Vaccination Analytics</h1>
        <p className="subtitle">Interactive Dashboard & Insights — India Statewise Data</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">
            <Activity size={18} color="var(--accent-blue)" />
            Total Doses Applied
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
            <AnimatedCounter value={totalDoses} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">
            <UserPlus size={18} color="var(--accent-purple)" />
            First Dose Total
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
            <AnimatedCounter value={firstDoses} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">
            <ShieldCheck size={18} color="var(--accent-pink)" />
            Second Dose Total
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-pink)' }}>
            <AnimatedCounter value={secondDoses} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">
            <Users size={18} color="#f59e0b" />
            Total Vaccinated People
          </div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            <AnimatedCounter value={data.gender[0].value + data.gender[1].value} />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Top States Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Top 10 States by Total Doses</h2>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topStates} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--text-secondary)"
                  width={130}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(name) => {
                    const abbr = {
                      'Uttar Pradesh': 'Uttar Pradesh',
                      'Madhya Pradesh': 'Madhya Pradesh',
                      'Andhra Pradesh': 'Andhra Pradesh',
                      'West Bengal': 'West Bengal',
                      'Tamil Nadu': 'Tamil Nadu',
                    };
                    return abbr[name] || name;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Total" fill="url(#barGradient)" radius={[0, 6, 6, 0]} barSize={24} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--accent-purple)" />
                    <stop offset="100%" stopColor="var(--accent-blue)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Gender Distribution</h2>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* First & Second Dose Comparison */}
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-header">
            <h2 className="chart-title">First vs Second Dose Administration (Top 15 States)</h2>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.doses} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFirst" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSecond" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-pink)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-pink)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="First" stroke="var(--accent-purple)" fillOpacity={1} fill="url(#colorFirst)" />
                <Area type="monotone" dataKey="Second" stroke="var(--accent-pink)" fillOpacity={1} fill="url(#colorSecond)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
