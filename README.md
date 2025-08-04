# betterstatus Server

A TypeScript based job processing server with API and worker services, built with Hono, BullMQ, and PostgreSQL.

## Architecture

This project consists of two main services:

- **API Server**: HTTP API built with Hono for job management and scheduling
- **Worker Service**: Background job processor using BullMQ and Redis

Both services can be deployed independently while sharing the same database and Redis instance.

## Features

- 🔄 **Job Queue Management**: Redis-based job queue with BullMQ
- ⏰ **Scheduled Jobs**: Automatic job scheduling and execution
- 🔐 **Authentication**: JWT-based authentication system
- 🛡️ **Security**: Rate limiting, CORS, and secure headers
- 📊 **Database**: PostgreSQL with Drizzle ORM
- 🚀 **Deployment Ready**: Configured for Render (API) and Railway (Workers)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Hono (API)
- **Database**: PostgreSQL with Drizzle ORM
- **Queue**: Redis with BullMQ
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd betterstatus-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Redis
REDIS_URL=redis://localhost:6379



# Security
JWT_SECRET=your-jwt-secret
ENC_KEY=your-encryption-key

# Server
PORT=8080
NODE_ENV=development
CORS_ORIGIN=*
```

### Database Setup

```bash
# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open database studio (optional)
npm run db:studio
```

### Development

```bash
# Start API server in development mode
npm run dev

# Start workers in development mode
npm run workers

# Build for production
npm run build

# Type checking
npm run type-check
```

## Project Structure

```
src/
├── controller/          # Request handlers
├── db/                 # Database schema and configuration
├── lib/                # Core libraries (job queue, workers, etc.)
├── middleware/         # Express/Hono middleware
├── routes/             # API route definitions
├── services/           # Business logic services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── index.ts            # Main application setup
├── server.ts           # API server entry point
└── workers.ts          # Worker service entry point
```

## API Endpoints

### Health Check

- `GET /health` - Service health status

### Jobs

- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Users

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile

## Job Processing

### Job Queue

Jobs are processed through a Redis-based queue using BullMQ:

1. **Job Creation**: API creates jobs and adds them to the queue
2. **Job Processing**: Workers pick up jobs from the queue
3. **Job Execution**: Workers execute the job logic
4. **Job Completion**: Results are stored in the database

### Scheduling

Jobs can be scheduled to run at specific intervals:

- Automatic scheduling every 30 seconds
- Jobs are executed when `next_run_at` time is reached
- Failed jobs are retried automatically

## Deployment

### API Deployment (Render)

1. Connect your GitHub repository to Render
2. Configure as a Web Service
3. Set environment variables
4. Deploy

See `DEPLOYMENT.md` for detailed instructions.

### Worker Deployment (Railway)

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the configuration
3. Set environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL=your-production-postgres-url
REDIS_URL=your-production-redis-url

JWT_SECRET=your-production-jwt-secret
ENC_KEY=your-production-encryption-key
NODE_ENV=production
PORT=10000
CORS_ORIGIN=your-frontend-domain
```

## Development

### Scripts

- `npm run dev` - Start API server in development
- `npm run workers` - Start workers in development
- `npm run build` - Build for production
- `npm run start` - Start production API server
- `npm run workers:prod` - Start production workers
- `npm run type-check` - TypeScript type checking
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open database studio

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Follow RESTful API conventions

## Monitoring

### API Monitoring

- Health check endpoint: `/health`
- Logs available in Render dashboard
- Metrics and performance monitoring

### Worker Monitoring

- Worker logs available in Railway dashboard
- Job processing status tracking
- Automatic restart on failures

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify `DATABASE_URL` is correct
   - Check database accessibility
   - Ensure SSL settings if required

2. **Redis Connection**
   - Verify `REDIS_URL` is correct
   - Check Redis accessibility
   - Ensure authentication if required

3. **Job Processing**
   - Check worker logs for errors
   - Verify Redis connection
   - Ensure job queue is being populated

### Health Checks

- API: `GET /health`
- Workers: Check Railway logs for activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License - see LICENSE file for details.
