 Simple Lambda API Test

A minimal Node.js/Express app to test AWS Lambda and API Gateway integration.

## Prerequisites
- Node.js 20.x
- AWS CLI configured
- AWS SAM CLI installed
- Docker (for local testing)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Test locally:
   ```bash
   sam local start-api
   ```
   - Test with: `curl http://localhost:3000/hello`
3. Deploy to AWS:
   ```bash
   sam build
   # If you get an error about the stack being in ROLLBACK_COMPLETE state, delete the stack first:
   aws cloudformation delete-stack --stack-name <stack-name>
   # Then deploy again:
   sam deploy --guided
   ```
   - Use the ApiUrl from output to test (e.g., `curl <ApiUrl>/hello`).
4. Cleanup:
   ```bash
   aws cloudformation delete-stack --stack-name <stack-name>
```