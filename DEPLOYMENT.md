# Deployment Guide

This guide will help you deploy your API on Render and workers on Railway.

## Prerequisites

1. **Database**: Set up a PostgreSQL database (you can use Railway, Supabase, or any other provider)
2. **Redis**: Set up a Redis instance (you can use Railway, Upstash, or any other provider)
3. **GitHub Repository**: Push your code to GitHub

## Environment Variables

### API (Render)

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string (for job queue)
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST URL (for rate limiting)
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token (for rate limiting)
- `JWT_SECRET`: Secret key for JWT tokens
- `ENC_KEY`: Encryption key
- `NODE_ENV`: production
- `PORT`: 10000
- `CORS_ORIGIN`: "\*" (or your frontend domain)

### Workers (Railway)

- `DATABASE_URL`: Same PostgreSQL connection string as API
- `REDIS_URL`: Same Redis connection string as API (for job queue)
- `UPSTASH_REDIS_REST_URL`: Same Upstash Redis REST URL as API (for rate limiting)
- `UPSTASH_REDIS_REST_TOKEN`: Same Upstash Redis REST token as API (for rate limiting)
- `JWT_SECRET`: Same JWT secret as API
- `ENC_KEY`: Same encryption key as API
- `NODE_ENV`: production

## Deploy API on Render

1. **Connect Repository**:

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:

   - **Name**: `batchbird-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose appropriate plan (Free tier available)

3. **Set Environment Variables**:

   - Add all the API environment variables listed above
   - Mark sensitive variables as "Secret"

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically deploy your API

## Deploy Workers on Railway

1. **Connect Repository**:

   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**:

   - Railway will automatically detect the `railway.json` configuration
   - The service will use `npm run workers:prod` as the start command

3. **Set Environment Variables**:

   - Go to the "Variables" tab
   - Add all the worker environment variables listed above
   - Make sure `DATABASE_URL` and `REDIS_URL` match the API service

4. **Deploy**:
   - Railway will automatically deploy your workers
   - The service will restart automatically on failures

## Database Setup

1. **Create Database**:

   - Use Railway, Supabase, or any PostgreSQL provider
   - Get the connection string

2. **Run Migrations**:
   - You can run migrations from either service
   - Add this to your deployment script if needed:
   ```bash
   npm run db:migrate
   ```

## Redis Setup

1. **Create Redis Instance**:

   - Use Railway, Upstash, or any Redis provider
   - Get the connection string

2. **Verify Connection**:
   - Both services should be able to connect to the same Redis instance
   - This enables job queue communication between API and workers

## Monitoring

### API (Render)

- Check the "Logs" tab for application logs
- Monitor the "Metrics" tab for performance
- Set up alerts for downtime

### Workers (Railway)

- Check the "Logs" tab for worker logs
- Monitor job processing status
- Set up alerts for worker failures

## Troubleshooting

### Common Issues

1. **Database Connection**:

   - Ensure `DATABASE_URL` is correct
   - Check if database is accessible from both services
   - Verify SSL settings if required

2. **Redis Connection**:

   - Ensure `REDIS_URL` is correct
   - Check if Redis is accessible from both services
   - Verify authentication if required

3. **Build Failures**:

   - Check if all dependencies are in `package.json`
   - Verify TypeScript compilation
   - Check for missing environment variables

4. **Worker Not Processing Jobs**:
   - Verify Redis connection
   - Check worker logs for errors
   - Ensure job queue is being populated by API

### Health Checks

- **API**: Visit `https://your-api.onrender.com/health`
- **Workers**: Check Railway logs for worker activity

## Scaling

### API Scaling (Render)

- Upgrade to paid plan for auto-scaling
- Configure instance count based on traffic

### Worker Scaling (Railway)

- Railway automatically scales based on resource usage
- You can manually adjust resources in the dashboard

## Security

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Configure `CORS_ORIGIN` to your frontend domain
3. **Rate Limiting**: Already configured in your API
4. **SSL**: Both Render and Railway provide SSL by default
