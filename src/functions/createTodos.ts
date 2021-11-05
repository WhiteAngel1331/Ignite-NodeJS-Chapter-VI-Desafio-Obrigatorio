import {v4 as uuidV4} from "uuid";

import {document} from "../utils/dynamodbClient";
import {APIGatewayProxyHandler} from "aws-lambda";

interface ICreateTODO {
  deadline: string;
  title: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const {id: user_id} = event.pathParameters;

  const {deadline, title} = JSON.parse(event.body) as ICreateTODO;

  const TODO = {
    id: uuidV4(),
    user_id,
    title,
    done: false,
    deadline: new Date(deadline),
  };

  await document
    .put({
      TableName: "users_todos",
      Item: TODO,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "TODO CREATED",
      data: TODO,
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
