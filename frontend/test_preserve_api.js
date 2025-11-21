const axios = require('axios');

const API_BASE_URL = 'https://api.evorii.online/api';

async function testPreserveAPI() {
  console.log('🧪 Testing Preserve Conserve API...\n');

  try {
    // Test 1: Test the main endpoint
    console.log('1. Testing main endpoint /api/preserve-conserve...');
    const response = await axios.get(`${API_BASE_URL}/preserve-conserve`, {
      timeout: 10000
    });
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response data:', JSON.stringify(response.data, null, 2));
    
    // Check if data structure is correct
    if (response.data.content) {
      console.log('✅ Content data found:', {
        title: response.data.content.title,
        subtitle: response.data.content.subtitle,
        hasDescription: !!response.data.content.description,
        hasBackgroundImage: !!response.data.content.background_image_url
      });
    } else {
      console.log('❌ No content data found');
    }
    
    if (response.data.features && response.data.features.length > 0) {
      console.log('✅ Features data found:', {
        count: response.data.features.length,
        firstFeature: response.data.features[0]
      });
    } else {
      console.log('❌ No features data found');
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testPreserveAPI();
