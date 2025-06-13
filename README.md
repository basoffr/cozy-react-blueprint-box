# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/781735e8-ca55-479f-bdbb-e472c7991ba0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/781735e8-ca55-479f-bdbb-e472c7991ba0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/781735e8-ca55-479f-bdbb-e472c7991ba0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Backend API

### Campaigns

The backend provides a RESTful API for managing campaigns with owner-based access control.

#### Endpoints

| Method | Path | Description | Status Codes |
|--------|------|-------------|-------------|
| GET | `/campaigns` | List all campaigns for authenticated user | 200, 500 |
| POST | `/campaigns` | Create a new campaign | 201, 400, 500 |
| GET | `/campaigns/<uuid>` | Get a specific campaign by ID | 200, 404, 500 |
| PATCH | `/campaigns/<uuid>` | Update a specific campaign | 200, 400, 404, 500 |
| DELETE | `/campaigns/<uuid>` | Delete a specific campaign | 204, 404, 500 |

#### Authentication

All endpoints require authentication:
- Production: `Authorization: Bearer <supabase-jwt>`
- Development: `X-API-Key: dev-secret`

#### Example Request (Development)

```bash
# List all campaigns
curl -X GET http://localhost:5000/campaigns \
  -H "X-API-Key: dev-secret"

# Create a new campaign
curl -X POST http://localhost:5000/campaigns \
  -H "X-API-Key: dev-secret" \
  -H "Content-Type: application/json" \
  -d '{"name": "Summer Sale 2025", "description": "Promotional campaign for summer products"}'
```

#### Example Campaign Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Summer Sale 2025",
  "description": "Promotional campaign for summer products",
  "owner": "auth0|user123",
  "created_at": "2025-06-01T12:00:00Z",
  "updated_at": "2025-06-01T12:00:00Z"
}
```

#### Row-Level Security

All campaign data is owner-scoped using Supabase Row-Level Security (RLS). This means users can only access campaigns they own, as determined by the `owner` field which is automatically set to the authenticated user's ID during creation.
