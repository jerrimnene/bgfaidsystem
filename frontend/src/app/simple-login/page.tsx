'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Simple login attempt:', { email, password });
    
    // Create user data
    const userData = {
      id: '1',
      email: email || 'demo@bgf.com',
      first_name: 'Demo',
      last_name: 'User',
      role: email.includes('admin') ? 'admin' : 'applicant',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const token = 'demo-token-' + Date.now();
    
    try {
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Data saved to localStorage');
      console.log('Token:', localStorage.getItem('token'));
      console.log('User:', localStorage.getItem('user'));
      
      // Redirect immediately
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '1.5rem' 
        }}>
          BGF Aid System - Simple Login
        </h1>
        
        <div style={{ 
          backgroundColor: '#dbeafe', 
          padding: '1rem', 
          borderRadius: '0.25rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Admin: admin@bgf.com<br/>
          User: user@example.com<br/>
          Password: any password
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a 
            href="/test-login" 
            style={{ color: '#2563eb', fontSize: '0.875rem', textDecoration: 'underline' }}
          >
            Try Test Login Page
          </a>
        </div>
      </div>
    </div>
  );
}