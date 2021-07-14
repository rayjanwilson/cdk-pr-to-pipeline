import { Context, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

const handler = (event: APIGatewayProxyEventV2, context: Context): APIGatewayProxyResultV2 => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));

  return {
    statusCode: 200,
    body: JSON.stringify({
      event,
    }),
  };
};

export { handler };
