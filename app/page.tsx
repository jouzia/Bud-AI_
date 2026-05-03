"use client";
import React, { useState, useEffect } from 'react';
// Use '../' to step out of the /app folder and find your files in the root
import Auth from './Auth';
import Main from './Main';
import './globals.css';
import './styles.css';

export default function AntigravityApp() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check for existing session in Cuddalore local storage
    const savedSession = localStorage.getItem('bud_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
      setLoading(false);
      return;
    }

    let start = Date.now();
    const timer = setInterval(() => {
      let elapsed = Date.now() - start;
      let val = Math.min((elapsed / 2600) * 100, 100);
      setProgress(val);
      if (val === 100) {
        clearInterval(timer);
        setTimeout(() => setLoading(false), 400);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const handleAuthComplete = (data) => {
    localStorage.setItem('bud_session', JSON.stringify(data));
    setSession(data);
  };

  if (loading) return <Loader progress={progress} />;

  return (
    <div className="min-h-screen font-nunito" style={{ background: '#0f0824', color: 'white' }}>
      {!session ? (
        <Auth onComplete={handleAuthComplete} />
      ) : (
        <Main user={session} apiKey={session.apiKey} />
      )}
    </div>
  );
}

function Loader({ progress }) {
  const words = ["Inspire", "Read", "Create"];
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    const i = setInterval(() => setIndex(s => (s + 1) % 3), 850);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#070612',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48
    }}>
      <div style={{ color: '#4E85BF', fontSize: 12, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
        Solo Army // Initialize
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: 'white' }}>
          {words[index]}
        </h2>
      </div>
      <div style={{ alignSelf: 'flex-end', fontSize: '12vw', fontFamily: "'Instrument Serif', serif", fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: 'white', opacity: 0.9 }}>
        {Math.round(progress).toString().padStart(3, '0')}
      </div>
    </div>
  );
}