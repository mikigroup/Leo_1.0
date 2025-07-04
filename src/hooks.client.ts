import * as Sentry from "@sentry/sveltekit";

// If you don't want to use Session Replay, remove the `Replay` integration,
// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
Sentry.init({
    dsn: "https://945c529c21324f78bf290bf4f0662070@o4504123775188992.ingest.us.sentry.io/4504124579184640",
    enabled: import.meta.env.DEV ? false : true, // Vypne Sentry v development módu
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.replayIntegration()]
});

export const handleError = Sentry.handleErrorWithSentry();
