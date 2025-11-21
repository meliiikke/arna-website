import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import { API_BASE_URL } from '../config/api';

const FrontendApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');

  useEffect(() => {
    setApiBaseUrl(API_BASE_URL);
  }, []);

  const testEndpoints = [
    { name: 'Health Check', endpoint: '/api/health' },
    { name: 'CORS Test', endpoint: '/api/cors-test' },
    { name: 'Who We Are', endpoint: '/api/who-we-are' },
    { name: 'Contact Info', endpoint: '/api/contact-info' },
    { name: 'Services', endpoint: '/api/services' },
    { name: 'Statistics', endpoint: '/api/statistics' }
  ];

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    console.log('🚀 Starting Frontend API Tests...');
    console.log('🌐 API Base URL:', apiBaseUrl);
    console.log('🌐 NODE_ENV:', process.env.NODE_ENV);
    console.log('🌐 REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);

    for (const test of testEndpoints) {
      try {
        console.log(`🔍 Testing ${test.name}: ${test.endpoint}`);
        const result = await apiGet(test.endpoint);
        
        console.log(`✅ ${test.name} result:`, result);
        
        setTestResults(prev => [...prev, {
          name: test.name,
          endpoint: test.endpoint,
          status: result.error ? 'FAILED' : 'SUCCESS',
          error: result.error || null,
          data: result.error ? null : result,
          timestamp: new Date().toISOString()
        }]);
      } catch (error) {
        console.error(`❌ ${test.name} error:`, error);
        setTestResults(prev => [...prev, {
          name: test.name,
          endpoint: test.endpoint,
          status: 'FAILED',
          error: error.message,
          data: null,
          timestamp: new Date().toISOString()
        }]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const successCount = testResults.filter(r => r.status === 'SUCCESS').length;
  const failCount = testResults.filter(r => r.status === 'FAILED').length;

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h2>🧪 Frontend API Test Results</h2>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>📋 Configuration Info:</h3>
        <p><strong>API Base URL:</strong> {apiBaseUrl}</p>
        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
        <p><strong>REACT_APP_API_BASE_URL:</strong> {process.env.REACT_APP_API_BASE_URL || 'Not set'}</p>
        <p><strong>Test Time:</strong> {new Date().toLocaleString()}</p>
      </div>

      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>📊 Summary:</h3>
        <p><strong>✅ Successful:</strong> {successCount}/{testResults.length}</p>
        <p><strong>❌ Failed:</strong> {failCount}/{testResults.length}</p>
        <p><strong>📈 Success Rate:</strong> {testResults.length > 0 ? Math.round((successCount / testResults.length) * 100) : 0}%</p>
      </div>

      <button 
        onClick={runTests} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? '🔄 Testing...' : '🔄 Run Tests Again'}
      </button>

      <div style={{ display: 'grid', gap: '15px' }}>
        {testResults.map((result, index) => (
          <div 
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: result.status === 'SUCCESS' ? '#f8fff8' : '#fff8f8'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h4 style={{ 
                margin: 0, 
                color: result.status === 'SUCCESS' ? '#28a745' : '#dc3545'
              }}>
                {result.status === 'SUCCESS' ? '✅' : '❌'} {result.name}
              </h4>
              <span style={{ 
                fontSize: '12px', 
                color: '#666'
              }}>
                {result.timestamp}
              </span>
            </div>
            
            <p><strong>Endpoint:</strong> {result.endpoint}</p>
            <p><strong>Status:</strong> {result.status}</p>
            
            {result.error && (
              <div style={{ 
                backgroundColor: '#ffe6e6', 
                padding: '10px', 
                borderRadius: '5px',
                marginTop: '10px'
              }}>
                <strong>Error:</strong> {result.error}
              </div>
            )}
            
            {result.data && (
              <div style={{ 
                backgroundColor: '#e6ffe6', 
                padding: '10px', 
                borderRadius: '5px',
                marginTop: '10px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                <strong>Data:</strong>
                <pre style={{ 
                  margin: '5px 0 0 0', 
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontendApiTest;

