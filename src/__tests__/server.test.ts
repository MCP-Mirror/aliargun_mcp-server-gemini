import WebSocket from 'ws';
import { MCPServer } from '../server';
import http from 'http';

describe('MCPServer', () => {
  let server: MCPServer;
  let client: WebSocket;
  const TEST_PORT = 3006;
  const API_KEY = 'test-api-key';

  beforeEach(() => {
    server = new MCPServer(API_KEY, TEST_PORT);
  });

  afterEach(async () => {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
    }
    await server.shutdown();
  });

  it('should start and accept connections', (done) => {
    client = new WebSocket(`ws://localhost:${TEST_PORT}`);
    
    client.on('open', () => {
      expect(client.readyState).toBe(WebSocket.OPEN);
      done();
    });
  });

  it('should handle health check endpoint', async () => {
    const response = await fetch(`http://localhost:${TEST_PORT}/health`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('activeConnections');
  });

  it('should handle initialization request', (done) => {
    client = new WebSocket(`ws://localhost:${TEST_PORT}`);
    
    client.on('open', () => {
      client.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {}
      }));
    });

    client.on('message', (data) => {
      const response = JSON.parse(data.toString());
      expect(response).toHaveProperty('result');
      expect(response.id).toBe(1);
      done();
    });
  });
});