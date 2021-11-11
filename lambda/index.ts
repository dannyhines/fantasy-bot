export const handler = async (event: any = {}): Promise<any> => {
  console.log("sup");
  console.log(event);

  return { statusCode: 201, body: "It worked" };
};
