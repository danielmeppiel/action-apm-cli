import * as core from '@actions/core';

/**
 * Handles parameter processing for AWD workflows
 */
export class ParameterHandler {
  
  /**
   * Gather all action inputs (except reserved ones) and convert to AWD parameters
   */
  gatherParameters(): string[] {
    const reservedInputs = new Set([
      'script',
      'working-directory',
      'github_token'  // Common but not passed as param
    ]);

    const params: string[] = [];
    
    // Get all possible inputs from the action context
    // In GitHub Actions, we can't enumerate all inputs, so we need to check common ones
    // This is a limitation of the Actions toolkit - we'll document expected parameters
    
    // For now, let's handle some common parameter patterns
    const commonParams = [
      'issue_number', 'pr_number', 'version', 'format', 'max_labels', 
      'focus', 'focus_areas', 'max_comments', 'service_name', 'severity',
      'target_env', 'instructions', 'name', 'environment'
    ];
    
    for (const paramName of commonParams) {
      const value = core.getInput(paramName);
      if (value && value.trim() !== '') {
        params.push(`--param`);
        params.push(`${paramName}=${value.trim()}`);
      }
    }
    
    // Also check for any input that looks like a parameter
    // Unfortunately, Actions toolkit doesn't provide a way to enumerate all inputs
    // so we rely on the common patterns above
    
    return params;
  }

  /**
   * Alternative method: Parse parameters from a single input (if needed)
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
