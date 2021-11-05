import {APIGatewayProxyHandler} from "aws-lambda";

import {document} from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const {id} = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_todos",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": id,
      },
    })
    .promise();

  const userTodos = response.Items[0];

  if (userTodos) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: userTodos,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Not Found!",
    }),
  };
};
