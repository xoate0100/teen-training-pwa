# Vercel Authentication Bypass Token Guide

This guide explains how to use Vercel's deployment protection bypass tokens to access your self-hosted ExerciseDB API from your workout application.

## 🔐 Overview

Your ExerciseDB API supports **dual authentication** for maximum flexibility:

1. **Vercel Bypass Tokens** - For simple, secure access using Vercel's built-in protection
2. **Custom API Keys** - For advanced access control with permissions and rate limiting

Both methods work simultaneously, allowing you to choose the best approach for each use case.

## 🔄 Authentication System

### How It Works

The API uses **Vercel's deployment protection** as the primary authentication method. When Vercel protection is active, the custom API key system is automatically disabled to allow bypass tokens to work seamlessly.

### Authentication Methods

1. **Vercel Bypass Tokens** (Primary - when Vercel protection is active)
   - URL parameter: `?x-vercel-protection-bypass=YOUR_TOKEN`
   - Header: `x-vercel-protection-bypass: YOUR_TOKEN`
   - Cookie: `x-vercel-protection-bypass=YOUR_TOKEN`

2. **API Keys** (Fallback - when Vercel protection is disabled)
   - Authorization header: `Authorization: Bearer YOUR_API_KEY`

### Configuration

- **Production**: Vercel protection active, API keys disabled
- **Development**: Can enable API keys by setting `DISABLE_API_KEY_WHEN_VERCEL_PROTECTED=false`
- **Custom**: Full control via environment variables

## 🚀 Quick Start

### 1. Generate a Bypass Token

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com) and log in
   - Navigate to your `epic_exercisedb` project

2. **Access Security Settings**
   - Click on **Settings** → **Security**
   - Look for **"Deployment Protection"** section

3. **Generate New Token**
   - Click **"Generate New Token"** or **"Bypass Token"**
   - Give it a descriptive name: `Workout App Access`
   - Copy the generated token (format: `vercel_bypass_xxxxxxxxxxxxxxxx`)

### 2. Store the Token Securely

```bash
# Add to your environment variables
VERCEL_BYPASS_TOKEN=vercel_bypass_your_actual_token_here
```

## 📱 Implementation in Your Workout App

### JavaScript/TypeScript Implementation

```javascript
class ExerciseDBClient {
  constructor(
    bypassToken,
    baseUrl = 'https://epicexercisedb-qo18rbbm7-xoate0100s-projects.vercel.app'
  ) {
    this.bypassToken = bypassToken;
    this.baseUrl = baseUrl;
  }

  /**
   * Make authenticated requests to the ExerciseDB API
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${this.bypassToken}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WorkoutApp/1.0',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Exercise endpoints
  async getExercises(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/v1/exercises?${queryString}`);
  }

  async searchExercises(query, threshold = 0.3) {
    return this.request(
      `/api/v1/exercises/search?q=${encodeURIComponent(query)}&threshold=${threshold}`
    );
  }

  async getExerciseById(id) {
    return this.request(`/api/v1/exercises/${id}`);
  }

  async getExercisesByMuscle(muscleName, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/api/v1/muscles/${muscleName}/exercises?${queryString}`
    );
  }

  async getExercisesByBodyPart(bodyPart, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/api/v1/bodyparts/${bodyPart}/exercises?${queryString}`
    );
  }

  async getExercisesByEquipment(equipment, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/api/v1/equipments/${equipment}/exercises?${queryString}`
    );
  }

  // Metadata endpoints
  async getMuscles() {
    return this.request('/api/v1/muscles');
  }

  async getBodyParts() {
    return this.request('/api/v1/bodyparts');
  }

  async getEquipments() {
    return this.request('/api/v1/equipments');
  }
}

// Usage example
const client = new ExerciseDBClient(process.env.VERCEL_BYPASS_TOKEN);

// Get all exercises
const exercises = await client.getExercises({ limit: 10 });

// Search for chest exercises
const chestExercises = await client.searchExercises('chest');

// Get specific exercise
const exercise = await client.getExerciseById('ztAa1RK');
```

### React/Next.js Implementation

```jsx
// hooks/useExerciseDB.js
import { useState, useEffect } from 'react';

const useExerciseDB = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initClient = () => {
      try {
        const bypassToken = process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN;
        if (!bypassToken) {
          throw new Error('VERCEL_BYPASS_TOKEN is not configured');
        }

        const exerciseClient = new ExerciseDBClient(bypassToken);
        setClient(exerciseClient);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initClient();
  }, []);

  return { client, loading, error };
};

export default useExerciseDB;
```

### Node.js/Express Implementation

```javascript
// services/exerciseDBService.js
const axios = require('axios');

class ExerciseDBService {
  constructor(bypassToken) {
    this.baseURL =
      'https://epicexercisedb-qo18rbbm7-xoate0100s-projects.vercel.app';
    this.bypassToken = bypassToken;

    this.client = axios.create({
      baseURL: this.baseURL,
      params: {
        'x-vercel-set-bypass-cookie': 'true',
        'x-vercel-protection-bypass': this.bypassToken,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WorkoutApp/1.0',
      },
    });
  }

  async getExercises(params = {}) {
    const response = await this.client.get('/api/v1/exercises', { params });
    return response.data;
  }

  async searchExercises(query, threshold = 0.3) {
    const response = await this.client.get('/api/v1/exercises/search', {
      params: { q: query, threshold },
    });
    return response.data;
  }

  // ... other methods
}

module.exports = ExerciseDBService;
```

## 🔧 Alternative Authentication Methods

### Method 1: URL Parameters (Recommended)

```javascript
const url = `${baseURL}/api/v1/exercises?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${token}`;
```

### Method 2: Cookie Header

```javascript
const headers = {
  Cookie: `x-vercel-protection-bypass=${token}`,
  'Content-Type': 'application/json',
};
```

### Method 3: Custom Header (if supported)

```javascript
const headers = {
  'X-Vercel-Protection-Bypass': token,
  'Content-Type': 'application/json',
};
```

## 🛡️ Security Best Practices

### 1. Token Storage

```bash
# Environment variables (recommended)
VERCEL_BYPASS_TOKEN=vercel_bypass_your_token_here

# Or in a secure config file
const config = {
  vercelBypassToken: process.env.VERCEL_BYPASS_TOKEN
};
```

### 2. Token Rotation

- **Rotate tokens monthly** for security
- **Revoke unused tokens** immediately
- **Monitor token usage** in Vercel dashboard

### 3. Error Handling

```javascript
class ExerciseDBClient {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        throw new Error(
          'Invalid bypass token. Please check your VERCEL_BYPASS_TOKEN.'
        );
      }

      if (response.status === 403) {
        throw new Error('Access denied. Token may be expired or revoked.');
      }

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error('ExerciseDB API Error:', error);
      throw error;
    }
  }
}
```

## 🧪 Testing Your Setup

### 1. Test with cURL

```bash
# Test basic connectivity
curl -X GET "https://epicexercisedb-qo18rbbm7-xoate0100s-projects.vercel.app/api/v1/exercises?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=YOUR_TOKEN"

# Test search functionality
curl -X GET "https://epicexercisedb-qo18rbbm7-xoate0100s-projects.vercel.app/api/v1/exercises/search?q=chest&x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=YOUR_TOKEN"
```

### 2. Test with JavaScript

```javascript
// Test script
const testAPI = async () => {
  try {
    const client = new ExerciseDBClient('your_token_here');

    // Test basic endpoint
    const exercises = await client.getExercises({ limit: 5 });
    console.log(
      '✅ Basic API test passed:',
      exercises.data.length,
      'exercises'
    );

    // Test search
    const searchResults = await client.searchExercises('chest');
    console.log('✅ Search test passed:', searchResults.data.length, 'results');

    // Test metadata
    const muscles = await client.getMuscles();
    console.log('✅ Muscles test passed:', muscles.data.length, 'muscles');

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAPI();
```

## 📊 Monitoring and Analytics

### 1. Vercel Dashboard

- Monitor API usage in **Analytics** tab
- Check **Functions** tab for execution metrics
- Review **Logs** for any errors or issues

### 2. Custom Monitoring

```javascript
class ExerciseDBClient {
  constructor(bypassToken, baseUrl, options = {}) {
    this.bypassToken = bypassToken;
    this.baseUrl = baseUrl;
    this.metrics = options.metrics || false;
  }

  async request(endpoint, options = {}) {
    const startTime = Date.now();

    try {
      const response = await fetch(url, options);
      const duration = Date.now() - startTime;

      if (this.metrics) {
        console.log(
          `API Call: ${endpoint} - ${response.status} - ${duration}ms`
        );
      }

      return response.json();
    } catch (error) {
      if (this.metrics) {
        console.error(`API Error: ${endpoint} - ${error.message}`);
      }
      throw error;
    }
  }
}
```

## 🔄 Switching Between Authentication Methods

### Switch to API Keys (Disable Vercel Protection)

If you want to use the custom API key system instead:

1. **Disable Vercel Protection**
   - Go to Vercel Dashboard → Settings → Security
   - Turn off "Deployment Protection"

2. **Enable API Key Authentication**

   ```bash
   vercel env add DISABLE_API_KEY_WHEN_VERCEL_PROTECTED
   # Enter: false
   vercel deploy --prod
   ```

3. **Generate API Keys**
   - Use the API key management endpoints
   - Follow the `API_KEY_GUIDE.md` for detailed instructions

### Switch Back to Vercel Protection

To re-enable Vercel protection:

1. **Enable Vercel Protection**
   - Go to Vercel Dashboard → Settings → Security
   - Turn on "Deployment Protection"

2. **Disable API Key Authentication**

   ```bash
   vercel env add DISABLE_API_KEY_WHEN_VERCEL_PROTECTED
   # Enter: true
   vercel deploy --prod
   ```

3. **Generate Bypass Tokens**
   - Use Vercel's bypass token system
   - Update your app to use bypass tokens

## 🚨 Troubleshooting

### Common Issues

**"Authentication Required" Error**

- Check if bypass token is correct
- Verify token hasn't expired
- Ensure URL parameters are properly formatted

**"Access Denied" Error**

- Token may be revoked in Vercel dashboard
- Check if deployment protection is still enabled
- Verify token has proper permissions

**"API request failed" Error**

- Check network connectivity
- Verify API endpoint URLs
- Review Vercel function logs

### Debug Steps

1. **Verify Token Format**

   ```javascript
   const isValidToken = token.startsWith('vercel_bypass_');
   console.log('Token valid:', isValidToken);
   ```

2. **Test Basic Connectivity**

   ```bash
   curl -I "https://epicexercisedb-qo18rbbm7-xoate0100s-projects.vercel.app/"
   ```

3. **Check Vercel Logs**
   ```bash
   vercel logs https://epicexercisedb-qo18rbbm7-xoate0100s-projects.vercel.app
   ```

## 📚 API Endpoints Reference

### Exercise Endpoints

- `GET /api/v1/exercises` - Get all exercises
- `GET /api/v1/exercises/search?q={query}` - Search exercises
- `GET /api/v1/exercises/{id}` - Get specific exercise
- `GET /api/v1/exercises/filter` - Advanced filtering

### Metadata Endpoints

- `GET /api/v1/muscles` - Get all muscles
- `GET /api/v1/bodyparts` - Get all body parts
- `GET /api/v1/equipments` - Get all equipment

### Filtered Exercise Endpoints

- `GET /api/v1/muscles/{muscle}/exercises` - Exercises by muscle
- `GET /api/v1/bodyparts/{bodypart}/exercises` - Exercises by body part
- `GET /api/v1/equipments/{equipment}/exercises` - Exercises by equipment

## 🎯 Next Steps

1. **Generate your bypass token** in Vercel dashboard
2. **Implement the ExerciseDBClient** in your workout app
3. **Test all endpoints** to ensure they work
4. **Set up monitoring** for API usage
5. **Document the integration** for your team

Your ExerciseDB API is now ready to power your workout application with enterprise-level security! 🚀
