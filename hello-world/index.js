exports.handler = async (event, context) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));
        
        let name = 'World';
        
        // Handle GET: from queryStringParameters
        if (event.queryStringParameters?.name) {
            name = event.queryStringParameters.name;
        } 
        // Handle POST: from JSON body
        else if (event.body) {
            const body = JSON.parse(event.body);
            name = body.name || name;
        } 
        // Fallback: direct event.name (for non-API Gateway tests)
        else if (event.name) {
            name = event.name;
        }
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hello, ${name}!`,
                context: {
                    functionName: context.functionName || 'LocalTestFunction',
                    requestId: context.awsRequestId || 'local-request-id'
                }
            })
        };
        return response;
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
                error: error.message
            })
        };
    }
};