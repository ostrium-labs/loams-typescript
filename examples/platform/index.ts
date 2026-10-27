// Read-only auth/admin discovery. Run only when you have an authorized API key.
import { FeatureNotInVariantError, Loams } from '@loams/client';
import { API_KEY, ENDPOINT } from '../../shared/config.ts';

if (process.env.LOAMS_PLATFORM_EXAMPLE !== '1') {
  throw new Error('Set LOAMS_PLATFORM_EXAMPLE=1 to run the credentialed read-only platform example.');
}
if (!API_KEY && !process.env.LOAMS_TOKEN) {
  throw new Error('Set LOAMS_API_KEY or LOAMS_TOKEN to an authorized credential.');
}

const loams = Loams.fromEnv({ endpoint: ENDPOINT });
try {
  const providers = await loams.auth.listProviders({});
  console.log('sign-in methods:', { password: providers.password, totp: providers.totp, passkeys: providers.passkeys, oidc: providers.oidc.map((provider) => provider.name) });

  // These require an account with organization/project read permissions.
  const projects = await loams.admin.projects.list({ pageSize: 10 });
  console.log('projects:', projects.projects.map((project) => project.slug));
  const audit = await loams.admin.audit.list({ pageSize: 10 });
  console.log('recent audit events:', audit.events.length);

  if (await loams.system.available('live')) {
    const apps = await loams.live.admin.listApps({ pageSize: 10 });
    console.log('Live apps:', apps.apps.map((app) => app.name));
  } else {
    console.log('Live admin is unavailable in this engine build');
  }
} catch (error) {
  if (error instanceof FeatureNotInVariantError) {
    console.log(`optional module unavailable: ${error.reason}`);
  } else {
    throw error;
  }
}
