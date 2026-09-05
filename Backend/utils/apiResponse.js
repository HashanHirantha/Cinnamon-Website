export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' && error ? error.message || error : undefined,
  });
};

export const paginatedResponse = (res, items, total, page = 1, limit = 10, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data: {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};
