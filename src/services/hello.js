exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, world! - read from ${process.env.TABLE_NAME}`
    })
  };
};
