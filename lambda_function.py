import boto3
import json

runtime = boto3.client('sagemaker-runtime')

def lambda_handler(event, context):
    # Log the full event (for debugging)
    print("Received event:", event)

    body = event.get('body')
    if body:
        data = json.loads(body)
    elif event.get('queryStringParameters'):
        data = event['queryStringParameters']
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing request body or query parameters'})
        }
    
    # Example: get movie_title for recommendation
    movie_title = data.get("movie_title") or data.get("body")
    payload = json.dumps({"movie_title": movie_title})

    # Call SageMaker endpoint
    response = runtime.invoke_endpoint(
        EndpointName='sagemaker-scikit-learn-2025-10-27-09-00-40-707',
        ContentType='application/json',
        Body=payload
    )
    
    result = response['Body'].read().decode('utf-8')

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  # CORS header if needed
        },
        'body': result
    }
