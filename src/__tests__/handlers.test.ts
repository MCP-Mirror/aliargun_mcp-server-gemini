import { MCPHandlers } from '../handlers';
import { ProtocolManager } from '../protocol';
import { GoogleGenerativeAI } from '@google/generative-ai';

describe('MCPHandlers', () => {
  let handlers: MCPHandlers;
  let protocol: ProtocolManager;
  let model: any;

  beforeEach(() => {
    protocol = new ProtocolManager();
    model = new GoogleGenerativeAI('test-key').getGenerativeModel({ model: 'gemini-pro' });
    handlers = new MCPHandlers(model, protocol);
  });

  it('should handle initialization request', async () => {
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {}
    };

    const response = await handlers.handleRequest(request);
    expect(response).toHaveProperty('result');
    expect(response.id).toBe(1);
  });
});