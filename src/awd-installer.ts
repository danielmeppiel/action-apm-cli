import * as core from '@actions/core';
import * as exec from '@actions/exec';

/**
 * Handles AWD CLI installation and runtime setup
 */
export class AwdInstaller {
  
  /**
   * Ensure AWD CLI is installed and available
   */
  async ensureAwdInstalled(): Promise<void> {
    const awdVersion = core.getInput('awd-version') || 'latest';
    
    try {
      // First check if AWD is already available
      const checkResult = await exec.exec('awd', ['--version'], {
        ignoreReturnCode: true,
        silent: true
      });
      
      if (checkResult === 0) {
        core.info('✅ AWD CLI already installed');
        return;
      }
    } catch (error) {
      // AWD not found, need to install
    }

    core.info(`⬇️  Installing AWD CLI version: ${awdVersion}...`);
    
    try {
      // Install AWD using the official install script
      // The install script supports version selection via environment variable
      const installEnv = {
        ...process.env,
        AWD_VERSION: awdVersion === 'latest' ? '' : awdVersion
      };

      await exec.exec('sh', ['-c', 'curl -sSL https://raw.githubusercontent.com/danielmeppiel/awd-cli/main/install.sh | sh'], {
        env: installEnv
      });
      
      // Verify installation
      const verifyResult = await exec.exec('awd', ['--version'], {
        ignoreReturnCode: true
      });
      
      if (verifyResult !== 0) {
        throw new Error('AWD CLI installation verification failed');
      }
      
      core.info('✅ AWD CLI installed successfully');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to install AWD CLI: ${message}`);
    }
  }

  /**
   * Setup AI runtime (codex by default)
   */
  async setupRuntime(): Promise<void> {
    try {
      core.info('🤖 Setting up Codex runtime with GitHub Models...');
      
      const result = await exec.exec('awd', ['runtime', 'setup', 'codex'], {
        ignoreReturnCode: true,
        env: {
          ...process.env,
          // Ensure GITHUB_TOKEN is available for runtime setup
          GITHUB_TOKEN: process.env.GITHUB_TOKEN || core.getInput('github_token') || ''
        }
      });
      
      if (result === 0) {
        core.info('✅ Runtime setup completed');
      } else {
        core.warning('⚠️  Runtime setup had issues but continuing...');
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.warning(`Runtime setup warning: ${message}`);
      // Don't fail the action for runtime setup issues
    }
  }
}
