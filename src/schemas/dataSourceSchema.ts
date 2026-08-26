import { z } from "zod";

export const dataSourceSchema = z
  .object({
    type: z.enum(["text-file", "odbc"]),

    dataSource: z.string(),

    file: z.instanceof(File).nullable(),

    fieldSeparator: z.string(),
    rowSeparator: z.string(),

    treatDataAsNumeric: z.boolean(),
    uniqueId: z.boolean(),
    header: z.boolean(),

    timeColumn: z.string(),

    sqlDataSource: z.string(),

    authentication: z.enum(["trusted", "username-password"]),

    username: z.string(),
    password: z.string(),

    transposeOutputData: z.boolean(),
    directSqlQuery: z.boolean(),

    sqlQuery: z.string(),
  })
  .superRefine((data, ctx) => {
    // -----------------------------------
    // COMMON VALIDATION
    // -----------------------------------

    if (!data.dataSource) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dataSource"],
        message: "Please select a data source",
      });
    }

    // -----------------------------------
    // TEXT FILE VALIDATION
    // -----------------------------------

    if (data.type === "text-file") {
      if (!data.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: "Please choose a file",
        });
      }

      if (!data.fieldSeparator) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fieldSeparator"],
          message: "Please select a field separator",
        });
      }

      if (!data.rowSeparator) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rowSeparator"],
          message: "Please select a row separator",
        });
      }

      if (!data.timeColumn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["timeColumn"],
          message: "Please select a time column",
        });
      }
    }

    // -----------------------------------
    // ODBC VALIDATION
    // -----------------------------------

    if (data.type === "odbc") {
      if (!data.sqlDataSource) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sqlDataSource"],
          message: "Please select a SQL data source",
        });
      }

      // Username/password required only
      // when Username & Password authentication is selected.
      if (data.authentication === "username-password") {
        if (!data.username.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["username"],
            message: "Username is required",
          });
        }

        if (!data.password.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["password"],
            message: "Password is required",
          });
        }
      }

      // SQL query required only when
      // Direct SQL Query is checked.
      if (data.directSqlQuery && !data.sqlQuery.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sqlQuery"],
          message: "SQL query is required",
        });
      }
    }
  });

export type DataSourceFormData = z.infer<typeof dataSourceSchema>;