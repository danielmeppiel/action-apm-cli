import { ParameterHandler } from '../src/parameter-handler';

// Mock @actions/core
const mockInputs: { [key: string]: string } = {};

jest.mock('@actions/core', () => ({
  getInput: (name: string): string => mockInputs[name] || '',
  warning: (message: string): void => console.log(`WARNING: ${message}`)
}));

describe('ParameterHandler', () => {
  let handler: ParameterHandler;

  beforeEach(() => {
    handler = new ParameterHandler();
    // Clear mock inputs before each test
    Object.keys(mockInputs).forEach(key => delete mockInputs[key]);
  });

  describe('gatherParameters', () => {
    it('should handle JSON parameters only', () => {
      mockInputs.parameters = JSON.stringify({
        model: "gpt-4",
        temperature: "0.8",
        max_tokens: "1000"
      });
      mockInputs.args = '';

      const result = handler.gatherParameters();
      
      expect(result).toEqual([
        "--param", "model=gpt-4",
        "--param", "temperature=0.8", 
        "--param", "max_tokens=1000"
      ]);
    });

    it('should handle args only', () => {
      mockInputs.parameters = '';
      mockInputs.args = '--debug --verbose --custom-flag=value';

      const result = handler.gatherParameters();
      
      expect(result).toEqual([
        "--debug", 
        "--verbose", 
        "--custom-flag=value"
      ]);
    });

    it('should handle hybrid approach (both JSON parameters and args)', () => {
      mockInputs.parameters = JSON.stringify({
        model: "gpt-4",
        temperature: "0.8"
      });
      mockInputs.args = '--debug --verbose';

      const result = handler.gatherParameters();
      
      expect(result).toEqual([
        "--param", "model=gpt-4",
        "--param", "temperature=0.8",
        "--debug", 
        "--verbose"
      ]);
    });

    it('should handle empty inputs', () => {
      mockInputs.parameters = '';
      mockInputs.args = '';

      const result = handler.gatherParameters();
      
      expect(result).toEqual([]);
    });

    it('should handle complex arguments with quotes', () => {
      mockInputs.parameters = '';
      mockInputs.args = '--message "Hello world" --file \'path/to/file\' --flag';

      const result = handler.gatherParameters();
      
      expect(result).toEqual([
        "--message", "Hello world",
        "--file", "path/to/file", 
        "--flag"
      ]);
    });

    it('should handle invalid JSON and show warning', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      mockInputs.parameters = '{invalid json';
      mockInputs.args = '--debug';

      const result = handler.gatherParameters();
      
      expect(result).toEqual(["--debug"]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING:'));
      
      consoleSpy.mockRestore();
    });

    it('should handle parameters with special characters', () => {
      mockInputs.parameters = JSON.stringify({
        message: "Hello, world!",
        path: "/some/path/with spaces",
        special: "value=with=equals"
      });
      mockInputs.args = '';

      const result = handler.gatherParameters();
      
      expect(result).toEqual([
        "--param", "message=Hello, world!",
        "--param", "path=/some/path/with spaces",
        "--param", "special=value=with=equals"
      ]);
    });

    it('should handle boolean and number parameters correctly', () => {
      mockInputs.parameters = JSON.stringify({
        debug: true,
        count: 42,
        rate: 0.5,
        enabled: false
      });
      mockInputs.args = '';

      const result = handler.gatherParameters();
      
      expect(result).toEqual([
        "--param", "debug=true",
        "--param", "count=42",
        "--param", "rate=0.5",
        "--param", "enabled=false"
      ]);
    });
  });
});
