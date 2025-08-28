import * as core from '@actions/core';
import * as exec from '@actions/exec';

/**
 * Handles APM CLI installation and runtime setup
 */
export class AwdInstaller {
  
  /**
   * Ensure APM CLI is installed and available
   */
  async ensureAwdInstalled(): Promise<void> {
    const apmVersion = core.getInput('apm-version') || 'latest';
    
    try {
      // First check if APM is already available
      const checkResult = await exec.exec('apm', ['--version'], {
        ignoreReturnCode: true,
        silent: true
      });
      
      if (checkResult === 0) {
        core.info('✅ APM CLI already installed');
        return;
      }
    } catch (error) {
      // APM not found, need to install
    }

    core.info(`⬇️  Installing APM CLI version: ${apmVersion}...`);
    
    try {
      // Install APM using the official install script
      // The install script supports version selection via environment variable
      const installEnv = {
        ...process.env,
        APM_VERSION: apmVersion === 'latest' ? '' : apmVersion
      };

      await exec.exec('sh', ['-c', 'curl -sSL https://raw.githubusercontent.com/danielmeppiel/apm-cli/main/install.sh | sh'], {
        env: installEnv
      });
      
      // Add APM to PATH if it's not already there
      const apmPath = process.env.HOME + '/.apm/bin';
      if (process.env.PATH && !process.env.PATH.includes(apmPath)) {
        process.env.PATH = `${apmPath}:${process.env.PATH}`;
        core.addPath(apmPath);
        core.info(`📍 Added ${apmPath} to PATH`);
      }
      
      // Verify installation
      const verifyResult = await exec.exec('apm', ['--version'], {
        ignoreReturnCode: true
      });
      
      if (verifyResult !== 0) {
        throw new Error('APM CLI installation verification failed');
      }
      
      core.info('✅ APM CLI installed successfully');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to install APM CLI: ${message}`);
    }
  }

  /**
   * Setup AI runtime (codex by default)
   */
  async setupRuntime(): Promise<void> {
    try {
      core.info('🤖 Setting up Codex runtime with GitHub Models...');
      
      const result = await exec.exec('apm', ['runtime', 'setup', 'codex'], {
        ignoreReturnCode: true,
        env: {
          ...process.env,
          // Ensure GITHUB_TOKEN is available for runtime setup
          GITHUB_TOKEN: process.env.GITHUB_TOKEN || core.getInput('github_token') || ''
        }
      });
      
      if (result === 0) {
        core.info('✅ Runtime setup completed');
        
        // Temporary workaround: Add APM runtime directory to PATH for this session
        // TODO: Remove this once https://github.com/danielmeppiel/apm-cli/issues/XXX is fixed
        await this.addAwdRuntimeToPath();
      } else {
        core.warning('⚠️  Runtime setup had issues but continuing...');
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.warning(`Runtime setup warning: ${message}`);
      // Don't fail the action for runtime setup issues
    }
  }

  /**
   * Temporary workaround: Add APM runtime directory to PATH for the current session
   * This fixes the issue where runtime binaries aren't available immediately after setup
   * TODO: Remove this once APM-CLI properly updates PATH in current session
   */
  private async addAwdRuntimeToPath(): Promise<void> {
    try {
      const apmRuntimePath = process.env.HOME + '/.apm/runtimes';
      
      // Add to current process PATH
      if (process.env.PATH && !process.env.PATH.includes(apmRuntimePath)) {
        process.env.PATH = `${apmRuntimePath}:${process.env.PATH}`;
        core.addPath(apmRuntimePath);
        core.info(`📍 Added ${apmRuntimePath} to PATH for runtime binaries`);
      }
      
    } catch (error) {
      core.warning(`Could not update PATH for APM runtime: ${error}`);
    }
  }
}
