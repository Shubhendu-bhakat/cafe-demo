# Docker & CI/CD Setup Guide

## Overview

This project includes:
- **Dockerfile**: Multi-stage build for optimized backend image
- **GitHub Actions Workflow**: Automated build, test, and push to ECR
- **Test Suite**: Basic health checks

---

## Docker Setup

### Dockerfile Features
* Multi-stage build (reduces image size)
* Non-root user for security
* Health checks configured
* Proper signal handling with dumb-init
* Optimized for production

### Build Docker Image Locally

```bash
cd server
docker build -t cafe-api:latest .
```

### Run Docker Container

```bash
docker run -p 5000:5000 \
  -e DATABASE_URL="your_database_url" \
  -e JWT_SECRET="your_secret" \
  cafe-api:latest
```

---

## 🚀 GitHub Actions CI/CD

### Workflow Features
- ✅ Runs on `master` branch only
- ✅ Runs tests before building
- ✅ Builds and pushes to AWS ECR
- ✅ Tags images with commit SHA and `latest`
- ✅ Only pushes on successful tests

### Workflow Steps

1. **Test Stage**
   - Runs on every push/PR to master
   - Installs dependencies
   - Runs linting (if available)
   - Runs tests

2. **Build & Push Stage**
   - Only runs on merge to master
   - Builds Docker image
   - Pushes to ECR with two tags:
     - `{commit-sha}` (specific version)
     - `latest` (most recent)

### Workflow File Location
`.github/workflows/build-and-push.yml`

---

## 🔐 AWS Setup Required

### 1. Create IAM Role for GitHub Actions

```bash
# Policy for ECR access
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "arn:aws:ecr:ap-south-1:592172380899:repository/cafe/demo"
    },
    {
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    }
  ]
}
```

### 2. Add Trust Relationship

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::592172380899:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/coffee-shop-website-design:ref:refs/heads/master"
        }
      }
    }
  ]
}
```

### 3. Create ECR Repository (if not exists)

```bash
aws ecr create-repository \
  --repository-name cafe/demo \
  --region ap-south-1
```

---

## 📦 ECR Repository Details

- **Registry URL**: `592172380899.dkr.ecr.ap-south-1.amazonaws.com`
- **Repository**: `cafe/demo`
- **Image Format**: `{registry}/{repository}:{tag}`
- **Example**: `592172380899.dkr.ecr.ap-south-1.amazonaws.com/cafe/demo:abc123def`

---

## 🧪 Testing

### Run Tests Locally

```bash
cd server
npm test
```

### Test Files Location
`server/tests/health.js` - Basic health checks

### Health Checks Include
✅ app.js exists
✅ package.json exists
✅ routes/auth.js exists
✅ routes/booking.js exists
✅ middleware/auth.js exists
✅ prisma/schema.prisma exists

---

## 📊 Workflow Execution

### On Every Push to Master

```
1. Test Stage
   ├── Checkout code
   ├── Setup Node.js
   ├── Install dependencies
   ├── Run linting
   └── Run tests ✅

2. Build & Push Stage (only if tests pass)
   ├── Configure AWS credentials
   ├── Login to ECR
   ├── Build Docker image
   ├── Tag images
   └── Push to ECR ✅
```

---

## 🔍 Image Information

### Image Size
- Base: ~150MB (node:18-alpine)
- With dependencies: ~180-200MB (optimized)

### Environment Variables Required
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

### Exposed Ports
- `5000` (main API port)

### Health Check
- Endpoint: `GET http://localhost:5000/`
- Interval: 30 seconds
- Timeout: 3 seconds
- Start period: 40 seconds
- Retries: 3

---

## 📝 Docker Commands Reference

```bash
# Build image
docker build -t cafe-api:latest server/

# Run container
docker run -p 5000:5000 cafe-api:latest

# Tag for ECR
docker tag cafe-api:latest \
  592172380899.dkr.ecr.ap-south-1.amazonaws.com/cafe/demo:latest

# Push to ECR
docker push \
  592172380899.dkr.ecr.ap-south-1.amazonaws.com/cafe/demo:latest

# View logs
docker logs container_id

# Execute command in container
docker exec -it container_id node -v
```

---

## 🐛 Troubleshooting

### Build Fails
- Check if all source files exist
- Verify Node.js version compatibility
- Check for missing environment variables

### ECR Push Fails
- Verify AWS IAM role permissions
- Check ECR repository exists
- Verify AWS credentials configuration

### Tests Fail
- Check health.js test file
- Verify all required files exist in server/
- Check Node.js version (18+)

---

## ✨ Next Steps

1. ✅ Create IAM role in AWS with ECR permissions
2. ✅ Add `github-actions-role` ARN to workflow (if using different role)
3. ✅ Test locally: `docker build -t cafe-api:latest server/`
4. ✅ Push to GitHub and trigger workflow
5. ✅ Monitor GitHub Actions for build status

---

## 📚 Resources

- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Alpine Images](https://hub.docker.com/_/node)
