import { ParameterHandler } from '../src/parameter-handler';

// Mock @actions/core
const mockInputs: Record<string, string> = {};
const mockWarnings: string[] = [];

jest.mock('@actions/core', () => ({
  getInput: (name: string) => mockInputs[name] || '',
  warning: (message: string) => {
    mockWarnings.push(message);
    console.log(`WARNING: ${message}`);
  }
}));

describe('ParameterHandler - Hybrid Parameter Approach', () => {
  let handler: ParameterHandler;

  beforeEach(() => {
    handler = new ParameterHandler();
    // Clear mocks
    Object.keys(mockInputs).forEach(key => delete mockInputs[key]);
    mockWarnings.length = 0;
  });

  describe('JSON parameters only', () => {
    it('should convert JSON parameters to --param format', () => {
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

    it('should handle empty JSON object', () => {
      mockInputs.parameters = JSON.stringify({});
      mockInputs.args = '';

      const result = handler.gatherParameters();

      expect(result).toEqual([]);
    });
  });

  describe('Args only', () => {
    it('should parse simple arguments', () => {
      mockInputs.parameters = '';
      mockInputs.args = '--debug --verbose --custom-flag=value';

      const result = handler.gatherParameters();

      expect(result).toEqual(["--debug", "--verbose", "--custom-flag=value"]);
    });

    it('should handle arguments with quotes', () => {
      mockInputs.parameters = '';
      mockInputs.args = '--message "Hello world" --file \'path/to/file\' --flag';

      const result = handler.gatherParameters();

      expect(result).toEqual(["--message", "Hello world", "--file", "path/to/file", "--flag"]);
    });

    it('should handle empty args', () => {
      mockInputs.parameters = '';
      mockInputs.args = '';

      const result = handler.gatherParameters();

      expect(result).toEqual([]);
    });
  });

  describe('Hybrid approach', () => {
    it('should combine JSON parameters and args', () => {
      mockInputs.parameters = JSON.stringify({
        model: "gpt-4",
        temperature: "0.8"
      });
      mockInputs.args = '--debug --verbose';

      const result = handler.gatherParameters();

      expect(result).toEqual([
        "--param", "model=gpt-4",
        "--param", "temperature=0.8",
        "--debug", "--verbose"
      ]);
    });

    it('should prioritize args when both are present', () => {
      mockInputs.parameters = JSON.stringify({
        model: "gpt-4"
      });
      mockInputs.args = '--model gpt-3.5-turbo --debug';

      const result = handler.gatherParameters();

      expect(result).toEqual([
        "--param", "model=gpt-4",
        "--model", "gpt-3.5-turbo",
        "--debug"
      ]);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JSON gracefully', () => {
      mockInputs.parameters = '{invalid json';
      mockInputs.args = '--debug';

      const result = handler.gatherParameters();

      expect(result).toEqual(["--debug"]);
      expect(mockWarnings).toHaveLength(1);
      expect(mockWarnings[0]).toContain('Failed to parse parameters JSON');
    });

    it('should handle malformed arguments gracefully', () => {
      mockInputs.parameters = '';
      mockInputs.args = '--unclosed-quote "hello';

      const result = handler.gatherParameters();

      // Should still parse what it can
      expect(result).toContain('--unclosed-quote');
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in JSON values', () => {
      mockInputs.parameters = JSON.stringify({
        message: "Hello \"world\" with 'quotes'",
        path: "/path/with spaces/file.txt"
      });
      mockInputs.args = '';

      const result = handler.gatherParameters();

      expect(result).toEqual([
        "--param", "message=Hello \"world\" with 'quotes'",
        "--param", "path=/path/with spaces/file.txt"
      ]);
    });

    it('should handle numeric and boolean values in JSON', () => {
      mockInputs.parameters = JSON.stringify({
        count: 42,
        enabled: true,
        disabled: false,
        ratio: 3.14
      });
      mockInputs.args = '';

      const result = handler.gatherParameters();

      expect(result).toEqual([
        "--param", "count=42",
        "--param", "enabled=true",
        "--param", "disabled=false",
        "--param", "ratio=3.14"
      ]);
    });

    it('should handle whitespace-only inputs', () => {
      mockInputs.parameters = '   ';
      mockInputs.args = '   ';

      const result = handler.gatherParameters();

      expect(result).toEqual([]);
    });
  });
});
