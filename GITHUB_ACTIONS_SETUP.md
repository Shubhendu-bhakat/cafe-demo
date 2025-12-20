# GitHub Actions Configuration

## Setting Up AWS Credentials for GitHub Actions

### Option 1: Using IAM Role (Recommended - OIDC)

This is the most secure approach and is already configured in the workflow.

#### Step 1: Create OIDC Provider (One-time per Account)

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

#### Step 2: Create IAM Role

**Role Name**: `github-actions-role`

**Trust Relationship**:
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
          "token.actions.githubusercontent.com:sub": "repo:*:ref:refs/heads/master"
        }
      }
    }
  ]
}
```

**Inline Policy** (ECR Push):
```json
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

#### Step 3: Verify Role ARN

```bash
aws iam get-role --role-name github-actions-role --query 'Role.Arn'
```

Output should be:
```
arn:aws:iam::592172380899:role/github-actions-role
```

---

### Option 2: Using Access Keys (Less Secure)

If you prefer, you can use AWS Access Keys instead of OIDC.

#### Step 1: Create IAM User

```bash
aws iam create-user --user-name github-actions
```

#### Step 2: Add ECR Policy

```bash
aws iam put-user-policy \
  --user-name github-actions \
  --policy-name ecr-push \
  --policy-document '{
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
  }'
```

#### Step 3: Create Access Key

```bash
aws iam create-access-key --user-name github-actions
```

Output:
```json
{
  "AccessKey": {
    "AccessKeyId": "AKIA...",
    "SecretAccessKey": "..."
  }
}
```

#### Step 4: Add to GitHub Secrets

Go to: **Settings → Secrets and variables → Actions**

Add:
- `AWS_ACCESS_KEY_ID` = AccessKeyId
- `AWS_SECRET_ACCESS_KEY` = SecretAccessKey

#### Step 5: Update Workflow

Change this in `.github/workflows/build-and-push.yml`:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ env.AWS_REGION }}
```

---

## ✅ Verification

### Test Workflow Manually

Push to master branch:
```bash
git add .
git commit -m "Test CI/CD workflow"
git push origin master
```

### Check Workflow Status

1. Go to GitHub repo → **Actions** tab
2. Click on the workflow run
3. Check each step for status
4. View logs for details

### Verify Image in ECR

```bash
aws ecr describe-images \
  --repository-name cafe/demo \
  --region ap-south-1 \
  --query 'imageDetails[].{Tag:imageTags,Pushed:imageRepositoryType}'
```

---

## 🔄 Workflow Environment Variables

Current values in `.github/workflows/build-and-push.yml`:

```yaml
AWS_REGION: ap-south-1
ECR_REGISTRY: 592172380899.dkr.ecr.ap-south-1.amazonaws.com
ECR_REPOSITORY: cafe/demo
IMAGE_TAG: ${{ github.sha }}
```

---

## 📝 Summary

### Using OIDC (Recommended) ✅
- No secrets needed in GitHub
- More secure
- Uses temporary credentials
- Industry standard

### Using Access Keys (Alternative)
- Simpler setup
- Requires secret management
- Permanent credentials (less secure)
- Backup option

---

## 🚀 Next Steps

1. **Choose authentication method** (OIDC recommended)
2. **Set up AWS IAM** using provided commands
3. **Push to master** branch to trigger workflow
4. **Monitor** GitHub Actions for build status
5. **Verify** image pushed to ECR

All set! 🎉
