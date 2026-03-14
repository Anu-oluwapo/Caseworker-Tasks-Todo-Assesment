import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Caseworker Tasks API",
      version: "1.0.0",
      description: "REST API for creating and managing caseworker tasks.",
    },
    servers: [
      { url: "http://localhost:4000", description: "Local development server" },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f1a2b3c4d5e6f7a8b9c0d1",
            },
            title: {
              type: "string",
              example: "Review case file",
            },
            description: {
              type: "string",
              example: "Go through all documents for case #1023",
            },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "done"],
              example: "todo",
            },
            dueAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-20T00:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-13T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-13T10:00:00.000Z",
            },
          },
        },
        CreateTaskInput: {
          type: "object",
          required: ["title", "dueAt"],
          properties: {
            title: {
              type: "string",
              minLength: 2,
              maxLength: 120,
              example: "Review case file",
            },
            description: {
              type: "string",
              maxLength: 2000,
              example: "Go through all documents for case #1023",
            },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "done"],
              default: "todo",
            },
            dueAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-20T00:00:00.000Z",
            },
          },
        },
        UpdateTaskInput: {
          type: "object",
          description: "At least one field must be provided.",
          properties: {
            title: {
              type: "string",
              minLength: 2,
              maxLength: 120,
              example: "Updated case review",
            },
            description: {
              type: "string",
              maxLength: 2000,
              example: "Updated description",
            },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "done"],
            },
            dueAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-25T00:00:00.000Z",
            },
          },
        },
        UpdateStatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["todo", "in_progress", "done"],
              example: "in_progress",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            details: { type: "object" },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Invalid request payload",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                message: "Invalid payload",
                details: {
                  fieldErrors: {
                    title: ["String must contain at least 2 character(s)"],
                  },
                  formErrors: [],
                },
              },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Task not found" },
            },
          },
        },
        InvalidId: {
          description: "ID is not a valid MongoDB ObjectId",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Invalid ID format" },
            },
          },
        },
        InternalError: {
          description: "Unexpected server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Internal server error" },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.js"],
});
