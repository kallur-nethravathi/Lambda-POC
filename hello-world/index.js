const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));
        
        const tableName = process.env.TABLE_NAME;
        const httpMethod = event.httpMethod;
        
        if (httpMethod === 'GET') {
            // Handle GET: retrieve data from DynamoDB
            const name = event.queryStringParameters?.name || 'World';
            
            const params = {
                TableName: tableName,
                Key: {
                    name: name
                }
            };
            
            const result = await dynamodb.get(params).promise();
            
            const response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: `Hello, ${name}!`,
                    data: result.Item || { message: 'No data found for this name' },
                    context: {
                        functionName: context.functionName || 'LocalTestFunction',
                        requestId: context.awsRequestId || 'local-request-id'
                    }
                })
            };
            return response;
            
        } else if (httpMethod === 'POST') {
            // Handle POST: store data in DynamoDB
            const body = JSON.parse(event.body || '{}');
            const name = body.name || 'World';
            const message = body.message || `Hello, ${name}!`;
            
            const params = {
                TableName: tableName,
                Item: {
                    name: name,
                    message: message,
                    timestamp: new Date().toISOString(),
                    ttl: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
                }
            };
            
            await dynamodb.put(params).promise();
            
            const response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: 'Data stored successfully!',
                    storedData: {
                        name: name,
                        message: message
                    },
                    context: {
                        functionName: context.functionName || 'LocalTestFunction',
                        requestId: context.awsRequestId || 'local-request-id'
                    }
                })
            };
            return response;
            
        } else {
            // Handle other methods or direct invocation
            const name = event.name || 'World';
            
            const response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: `Hello, ${name}!`,
                    context: {
                        functionName: context.functionName || 'LocalTestFunction',
                        requestId: context.awsRequestId || 'local-request-id'
                    }
                })
            };
            return response;
        }
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Internal server error',
                error: error.message
            })
        };
    }
};