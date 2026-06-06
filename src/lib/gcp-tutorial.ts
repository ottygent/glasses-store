export const gcpTutorial = {
  title: "Google Cloud Platform Usage Guide",
  subtitle:
    "A practical, beginner-to-production walkthrough for setting up Google Cloud, deploying applications, managing access, controlling costs, and operating services with confidence.",
  updated: "June 6, 2026",
  readingTime: "28 min read",
  intro: [
    "Google Cloud Platform, usually shortened to GCP or Google Cloud, is a collection of cloud services for running applications, storing data, building APIs, analyzing logs, managing infrastructure, and shipping software without owning servers.",
    "This guide is written for builders who want a working mental model first and commands second. You will learn what to set up, why each piece matters, and how to avoid the expensive or insecure defaults that catch new teams.",
  ],
  sections: [
    {
      id: "account-projects-billing",
      title: "1. Start With The Account, Project, And Billing Model",
      body: [
        "Google Cloud is organized around projects. A project is the container for APIs, resources, IAM policies, logs, quotas, and billing attribution. Treat projects like real environments, not like random folders. A clean setup usually has separate projects for development, staging, and production.",
        "Before creating infrastructure, decide your naming convention. Use names that encode the app, environment, and owner, for example `lumalens-dev`, `lumalens-staging`, and `lumalens-prod`. This makes billing exports, IAM reviews, and incident response much easier later.",
        "Billing is attached to projects through a billing account. A project can spend money as soon as billing is enabled and billable APIs are used. Budget alerts are not hard spending caps, but they are still essential because they warn you when actual or forecasted costs cross thresholds.",
      ],
      checklist: [
        "Create one project per environment.",
        "Enable billing only on projects that need paid resources.",
        "Create budget alerts before deploying anything public.",
        "Add labels such as `app`, `env`, `owner`, and `cost-center` to resources.",
      ],
      commands: [
        "gcloud projects create lumalens-dev --name=\"LumaLens Dev\"",
        "gcloud config set project lumalens-dev",
        "gcloud beta billing projects link lumalens-dev --billing-account=BILLING_ACCOUNT_ID",
      ],
    },
    {
      id: "cli",
      title: "2. Install And Configure The Google Cloud CLI",
      body: [
        "The Google Cloud CLI gives you the `gcloud` command, which is the fastest way to inspect, deploy, script, and debug Google Cloud resources. You can do almost everything from the Console UI, but serious work becomes easier when your terminal and CI system use repeatable commands.",
        "After installing the CLI, run `gcloud init` to authenticate, choose a default project, and create a local configuration. You can maintain multiple named configurations if you work across personal, client, staging, and production environments.",
        "Use `gcloud auth login` for human development sessions. Use service accounts or workload identity for automation. Avoid downloading long-lived service account keys unless you absolutely need them, because keys become secrets you must rotate and protect.",
      ],
      checklist: [
        "Install the current Google Cloud CLI from official docs.",
        "Run `gcloud init` and select the right default project.",
        "Use named configurations for separate clients or environments.",
        "Never paste service account keys into source control or chat.",
      ],
      commands: [
        "gcloud init",
        "gcloud config configurations create lumalens-dev",
        "gcloud config set project lumalens-dev",
        "gcloud auth list",
      ],
    },
    {
      id: "iam",
      title: "3. Understand IAM Before You Deploy",
      body: [
        "Identity and Access Management, or IAM, controls who can do what. The important habit is least privilege: grant the smallest role needed at the narrowest resource level that still lets the person or workload do its job.",
        "Google Cloud has basic roles like Owner, Editor, and Viewer, but production setups should prefer predefined service-specific roles. For example, a deployment account might need Cloud Run Admin and Service Account User, while a runtime service account might only need Secret Manager Secret Accessor and Cloud SQL Client.",
        "Service accounts are identities for software. A Cloud Run service, Cloud Build pipeline, VM, or scheduled job can run as a service account. Keep deployer permissions and runtime permissions separate. The account that deploys an app usually needs more power than the app itself should have at runtime.",
      ],
      checklist: [
        "Use Google groups for human access instead of assigning roles person by person.",
        "Avoid Owner and Editor except for a small break-glass admin group.",
        "Create a dedicated runtime service account for each app.",
        "Review IAM policies on a schedule.",
      ],
      commands: [
        "gcloud iam service-accounts create lumalens-runner --display-name=\"LumaLens runtime\"",
        "gcloud projects add-iam-policy-binding PROJECT_ID --member=\"serviceAccount:lumalens-runner@PROJECT_ID.iam.gserviceaccount.com\" --role=\"roles/secretmanager.secretAccessor\"",
        "gcloud projects get-iam-policy PROJECT_ID --format=json",
      ],
    },
    {
      id: "apis",
      title: "4. Enable Only The APIs You Need",
      body: [
        "Google Cloud services are exposed through APIs. A new project often cannot use Cloud Run, Cloud Build, Artifact Registry, Secret Manager, or Cloud SQL until those APIs are enabled.",
        "For production, track enabled APIs as part of infrastructure setup instead of clicking them on randomly in the Console. This makes rebuilds and disaster recovery much less stressful.",
        "A small web app commonly starts with Cloud Run for hosting, Cloud Build for building containers, Artifact Registry for storing images, Secret Manager for secrets, Cloud Logging for logs, and Cloud Monitoring for alerts.",
      ],
      checklist: [
        "Enable APIs intentionally, ideally from a setup script or Terraform.",
        "Document why each enabled API exists.",
        "Disable APIs that are no longer used.",
      ],
      commands: [
        "gcloud services enable run.googleapis.com",
        "gcloud services enable cloudbuild.googleapis.com",
        "gcloud services enable artifactregistry.googleapis.com",
        "gcloud services enable secretmanager.googleapis.com",
      ],
    },
    {
      id: "cloud-run",
      title: "5. Deploy A Web App To Cloud Run",
      body: [
        "Cloud Run is usually the easiest production entry point for web apps and APIs. It runs containers, scales down when idle, handles HTTPS, and supports revisions so each deploy is traceable and rollbacks are straightforward.",
        "You can deploy from source with `gcloud run deploy --source .`, which asks Cloud Build to build a container using buildpacks. This is friendly for early projects because you do not need to write a Dockerfile immediately. Larger teams often switch to explicit Dockerfiles and CI/CD pipelines for more control.",
        "Decide whether the service should be public. A storefront or public API may use `--allow-unauthenticated`. Internal admin tools should require authentication and use IAM, Identity-Aware Proxy, or a private ingress design.",
      ],
      checklist: [
        "Choose a region close to users and data.",
        "Deploy with a dedicated runtime service account.",
        "Set memory, CPU, timeout, and max instances intentionally.",
        "Use revisions and traffic splitting for safer rollouts.",
      ],
      commands: [
        "gcloud run deploy lumalens-web --source . --region=us-central1 --allow-unauthenticated",
        "gcloud run services describe lumalens-web --region=us-central1",
        "gcloud run services update-traffic lumalens-web --to-latest --region=us-central1",
      ],
    },
    {
      id: "storage-databases",
      title: "6. Pick Storage Based On The Shape Of Your Data",
      body: [
        "Google Cloud has several storage products because different data shapes need different tools. Cloud Storage is for files and objects such as uploads, exports, images, and backups. Firestore is a document database for app state and flexible records. Cloud SQL is managed PostgreSQL, MySQL, or SQL Server for relational data. BigQuery is for analytics and large-scale reporting.",
        "Do not choose a database only because it is popular. Choose it based on access patterns. If you need transactions, joins, constraints, and existing SQL tooling, Cloud SQL is the natural default. If you need serverless documents and simple app-driven queries, Firestore can be faster to ship. If you need append-heavy analytics and dashboarding, BigQuery is built for that.",
        "Backups and retention should be decided before launch. A database without tested restore steps is not really backed up.",
      ],
      checklist: [
        "Use Cloud Storage for files, not as a database.",
        "Use Cloud SQL when relational integrity matters.",
        "Use Secret Manager for database passwords and API keys.",
        "Test restores, not just backups.",
      ],
      commands: [
        "gcloud storage buckets create gs://PROJECT_ID-assets --location=us-central1",
        "gcloud sql instances create lumalens-db --database-version=POSTGRES_16 --region=us-central1",
        "gcloud secrets create database-url --replication-policy=automatic",
      ],
    },
    {
      id: "secrets-config",
      title: "7. Manage Secrets And Configuration Cleanly",
      body: [
        "Configuration values are not all the same. Non-sensitive values like `NODE_ENV`, feature flags, or public API origins can live in environment variables. Sensitive values like database URLs, OAuth client secrets, Stripe keys, and webhook signing secrets belong in Secret Manager.",
        "Cloud Run can mount secrets into environment variables or files. Prefer environment variables for simple application settings and mounted files for larger credentials that libraries expect on disk.",
        "Rotate secrets deliberately. If a secret is used by both staging and production, split it. Shared secrets across environments turn a staging compromise into a production incident.",
      ],
      checklist: [
        "Keep `.env` files out of git.",
        "Separate staging and production secrets.",
        "Grant secret access only to the runtime service account that needs it.",
        "Record rotation steps in the project documentation.",
      ],
      commands: [
        "printf '%s' 'secret-value' | gcloud secrets versions add api-key --data-file=-",
        "gcloud run services update lumalens-web --set-secrets=API_KEY=api-key:latest --region=us-central1",
        "gcloud secrets versions list api-key",
      ],
    },
    {
      id: "observability",
      title: "8. Logs, Metrics, Alerts, And Debugging",
      body: [
        "A deployed app is only manageable if you can see what it is doing. Cloud Logging captures logs from Cloud Run, Cloud Build, GKE, VMs, and many managed services. Cloud Monitoring turns metrics into dashboards and alerts.",
        "Log useful events, not noise. A good production log tells you what happened, where it happened, which user or request was involved when appropriate, and whether the system recovered. Avoid logging passwords, tokens, payment card data, or private customer information.",
        "Start with basic alerts: high error rate, high latency, service unavailable, build failures, and budget forecast. Add business alerts later, such as checkout failures or unusually low order volume.",
      ],
      checklist: [
        "Use structured JSON logs when possible.",
        "Create alerts for symptoms users feel, not only CPU or memory.",
        "Keep dashboards small enough to read during an incident.",
        "Add log-based metrics for important application events.",
      ],
      commands: [
        "gcloud logging read 'resource.type=\"cloud_run_revision\"' --limit=50",
        "gcloud run services logs read lumalens-web --region=us-central1 --limit=100",
        "gcloud builds list --limit=10",
      ],
    },
    {
      id: "cost-control",
      title: "9. Control Cost Before Cost Controls You",
      body: [
        "Cloud bills usually grow from a few predictable places: always-on compute, large databases, egress traffic, logs retained too long, oversized environments, and forgotten experiments. The fix is not fear; it is visibility and defaults.",
        "Use budgets and alerts immediately, even for experiments. Labels make reports useful because you can group spend by app, environment, team, or feature. For serverless services like Cloud Run, set max instances so unexpected traffic cannot scale without a ceiling.",
        "For development environments, schedule resources down when not in use. For production, right-size based on observed metrics instead of guessing. Cost review should be a normal maintenance habit, not a panic activity after the invoice arrives.",
      ],
      checklist: [
        "Create budget alerts for every billing account.",
        "Label resources consistently.",
        "Set Cloud Run max instances for public services.",
        "Review billing reports weekly during active development.",
      ],
      commands: [
        "gcloud run services update lumalens-web --max-instances=10 --region=us-central1",
        "gcloud billing accounts list",
        "gcloud projects describe PROJECT_ID --format='value(labels)'",
      ],
    },
    {
      id: "production-path",
      title: "10. A Sensible Production Path",
      body: [
        "A practical production path starts small: one Cloud Run service, one managed database if needed, Secret Manager, Cloud Logging, budget alerts, and a CI/CD pipeline. Add complexity only when the app proves it needs it.",
        "For a Next.js or ecommerce-style app, static hosting may be enough for the public storefront, while API routes, checkout webhooks, admin tools, and background jobs run on Cloud Run. This split keeps the public surface fast and cheap while still giving the backend a secure place to handle secrets.",
        "Before launch, write down the deploy command, rollback command, required secrets, service accounts, domain setup, and support contacts. Future-you will be grateful when something breaks on a Friday evening.",
      ],
      checklist: [
        "Use GitHub Actions or Cloud Build for repeatable deploys.",
        "Keep production deploys tied to commits.",
        "Document rollback steps.",
        "Run a pre-launch review for IAM, secrets, billing, backups, and alerts.",
      ],
      commands: [
        "gcloud run revisions list --service=lumalens-web --region=us-central1",
        "gcloud run services update-traffic lumalens-web --to-revisions=REVISION_NAME=100 --region=us-central1",
        "gcloud run domain-mappings create --service=lumalens-web --domain=example.com --region=us-central1",
      ],
    },
  ],
  sources: [
    {
      label: "Install the Google Cloud CLI",
      href: "https://docs.cloud.google.com/sdk/docs/install",
    },
    {
      label: "IAM roles overview",
      href: "https://cloud.google.com/iam/docs/roles-overview",
    },
    {
      label: "Service accounts overview",
      href: "https://docs.cloud.google.com/iam/docs/service-account-overview",
    },
    {
      label: "Deploy services from source to Cloud Run",
      href: "https://docs.cloud.google.com/run/docs/deploying-source-code",
    },
    {
      label: "Create budgets and budget alerts",
      href: "https://docs.cloud.google.com/billing/docs/how-to/budgets",
    },
  ],
};
