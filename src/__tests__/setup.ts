import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock Google Generative AI
jest.mock('@google/generative-ai');

beforeAll(() => {
  // Setup mock implementations
  (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Mock response'
        }
      })
    })
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});