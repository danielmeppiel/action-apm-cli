import * as core from '@actions/core';

/**
 * Handles parameter processing for APM workflows
 * Supports both JSON parameters (user-friendly) and raw CLI args (power users)
 */
export class ParameterHandler {
  
  /**
   * Gather all action inputs and convert to APM CLI arguments
   * Supports hybrid approach: JSON parameters + additional CLI args
   */
  gatherParameters(): string[] {
    const allArgs: string[] = [];
    
    // First, process JSON parameters (user-friendly approach)
    const parametersInput = core.getInput('parameters');
    if (parametersInput && parametersInput.trim() !== '' && parametersInput.trim() !== '{}') {
      const jsonParams = this.parseJsonParameters(parametersInput);
      allArgs.push(...jsonParams);
    }
    
    // Then, add any additional CLI arguments (power user escape hatch)
    const argsInput = core.getInput('args');
    if (argsInput && argsInput.trim() !== '') {
      const parsedArgs = this.parseArguments(argsInput.trim());
      allArgs.push(...parsedArgs);
    }
    
    return allArgs;
  }

  /**
   * Parse JSON parameters into CLI arguments
   */
  private parseJsonParameters(parametersInput: string): string[] {
    const params: string[] = [];
    
    try {
      const jsonParams = JSON.parse(parametersInput);
      
      // Validate it's an object
      if (typeof jsonParams === 'object' && jsonParams !== null && !Array.isArray(jsonParams)) {
        for (const [key, value] of Object.entries(jsonParams)) {
          if (value !== null && value !== undefined) {
            params.push(`--param`);
            params.push(`${key}=${value}`);
          }
        }
      } else {
        core.warning('Parameters input must be a JSON object, ignoring invalid format');
      }
    } catch (error) {
      core.warning(`Failed to parse parameters JSON: ${error}. Expected format: {"key": "value", "key2": "value2"}`);
    }
    
    return params;
  }

  /**
   * Parse command line arguments, respecting quotes and escaping
   * This handles cases like: --debug --verbose --custom-flag=value
   */
  private parseArguments(argsString: string): string[] {
    const args: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];
      const nextChar = argsString[i + 1];
      
      if ((char === '"' || char === "'") && !inQuotes) {
        // Start of quoted string
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        // End of quoted string
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        // Space outside quotes - end current argument
        if (current.trim()) {
          args.push(current.trim());
          current = '';
        }
      } else if (char === '\\' && nextChar && inQuotes) {
        // Escape character in quotes
        current += nextChar;
        i++; // Skip next character
      } else {
        // Regular character
        current += char;
      }
    }
    
    // Add final argument if exists
    if (current.trim()) {
      args.push(current.trim());
    }
    
    return args;
  }

  /**
   * Legacy method: Parse parameters from a single input (kept for backwards compatibility)
   * @deprecated Use the hybrid approach with both parameters and args inputs
   */
  parseParametersFromInput(paramString: string): string[] {
    if (!paramString || paramString.trim() === '') {
      return [];
    }

    const params: string[] = [];
    
    // Support both JSON and key=value formats
    try {
      // Try JSON format first
      const jsonParams = JSON.parse(paramString);
      for (const [key, value] of Object.entries(jsonParams)) {
        params.push(`--param`);
        params.push(`${key}=${value}`);
      }
    } catch {
      // Fall back to key=value format
      const lines = paramString.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && trimmed.includes('=')) {
          params.push(`--param`);
          params.push(trimmed);
        }
      }
    }
    
    return params;
  }
}
