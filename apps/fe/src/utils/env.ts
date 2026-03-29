/**
 * FIXME: figure out a way to call env variable by its full path name (for example process.env.NEXT_PUBLIC_FE_HOST) and not by just it's name.
 * Throws an error if the environment variable is not set.
 * @param env - Environment variable
 * @returns Environment variable. If the environment variable is not set, throws an error.
 */
export const throwIfMissingEnv = (env: string): string => {
  if (process.env[env]) {
    return process.env[env];
  }
  console.error(`Environment variable ${env} is required, but is not set. Please set it in .env file or in the environment.`);
  throw new Error(`Environment variable ${env} is required, but is not set. Please set it in .env file or in the environment.`);
};
