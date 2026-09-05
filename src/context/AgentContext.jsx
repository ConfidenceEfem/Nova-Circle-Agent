import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';

const AgentContext = createContext(null);

const POLL_MS = 30000; // re-check agent status every 30s so the toggle stays accurate

export function AgentProvider({ children }) {
  const [running, setRunning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
      const status = await api.getAgentStatus();
      setRunning(status.running);
      setLastScan(status.lastScanAt ? new Date(status.lastScanAt).toLocaleTimeString() : 'never yet');
      setDemoMode(status.demoMode);
      setConnected(true);
    } catch {
      setConnected(false); // backend unreachable — surfaced in the nav as a disconnected state
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const id = setInterval(refreshStatus, POLL_MS);
    return () => clearInterval(id);
  }, [refreshStatus]);

  const toggle = async () => {
    setBusy(true);
    try {
      if (running) await api.stopAgent();
      else await api.startAgent();
      await refreshStatus();
    } finally {
      setBusy(false);
    }
  };

 const scanNow = async () => {
  setBusy(true);
  try {
    await api.scanNow();
    await refreshStatus();
  } catch (err) {
    alert(`Scan failed: ${err.message}`);
  } finally {
    setBusy(false);
  }
};

  return (
    <AgentContext.Provider value={{ running, toggle, lastScan, demoMode, connected, busy, scanNow, refreshStatus }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within an AgentProvider');
  return ctx;
}
