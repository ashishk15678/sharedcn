import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure, protectedProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  // Components
  components: createTRPCRouter({
    // Get all components for authenticated user
    list: protectedProcedure.query(async ({ ctx }) => {
      const components = await ctx.prisma.component.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
        include: {
          metrics: true,
          files: true,
        },
      });
      return components;
    }),

    // Get all components (public)
    all: baseProcedure.query(async ({ ctx }) => {
      const data = await ctx.prisma.component.findMany({
        include: {
          metrics: true,
          files: true,
        },
      });
      return data;
    }),

    // Get component by ID
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const component = await ctx.prisma.component.findUnique({
          where: { id: input.id, userId: ctx.userId },
        });
        if (!component) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return component;
      }),

    // Create component
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string(),
          type: z.enum(["component", "setup"]).default("component"),
          tags: z.array(z.string()).optional(),
          dependencies: z.array(z.string()).optional(),
          devDependencies: z.array(z.string()).optional(),
          registryDependencies: z.array(z.string()).optional(),
          installCommand: z.string().optional(),
          isPublic: z.boolean().default(true),
          files: z.array(
            z.object({
              filename: z.string(),
              code: z.string(),
            }),
          ),
          mainFile: z.string(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        // File extension validation - more permissive for setups
        const componentAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html"];
        const setupAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html", ".json", ".md", ".env", ".yml", ".yaml", ".toml", ".prisma"];
        const allowed = input.type === "setup" ? setupAllowed : componentAllowed;
        
        if (
          !input.files.every((f) =>
            allowed.some((ext) => f.filename.endsWith(ext)) || f.filename.includes(".")
          )
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invalid file types. For ${input.type}s, allowed extensions are: ${allowed.join(", ")}`,
          });
        }

        const main = input.files.find((f) => f.filename === input.mainFile);
        if (!main) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Main file not found in files.",
          });
        }

        // Get username for alias
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.userId },
          select: { username: true },
        });
        
        const username = user?.username || "user";
        const normalized = input.name.trim().toLowerCase().replace(/\s+/g, "-");
        const alias = `@${username}/${normalized}`;
        
        const exists = await ctx.prisma.component.findFirst({
          where: { alias },
        });
        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Alias already exists",
          });
        }

        const component = await ctx.prisma.component.create({
          data: {
            alias,
            userId: ctx.userId,
            description: input.description,
            type: input.type,
            tags: input.tags || [],
            dependencies: input.dependencies || [],
            devDependencies: input.devDependencies || [],
            registryDependencies: input.registryDependencies || [],
            installCommand: input.installCommand || null,
            isPublic: input.isPublic,
            mainFile: input.mainFile,
            files: {
              create: input.files.map((f) => ({
                filename: f.filename,
                code: f.code,
              })),
            },
          },
          include: { files: true },
        });
        return component;
      }),

    // Update component
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          files: z
            .array(
              z.object({
                filename: z.string(),
                code: z.string(),
              }),
            )
            .optional(),
          mainFile: z.string().optional(),
          description: z.string().optional(),
          type: z.enum(["component", "setup"]).optional(),
          tags: z.array(z.string()).optional(),
          dependencies: z.array(z.string()).optional(),
          devDependencies: z.array(z.string()).optional(),
          registryDependencies: z.array(z.string()).optional(),
          installCommand: z.string().nullable().optional(),
          isPublic: z.boolean().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const component = await ctx.prisma.component.findFirst({
          where: { id: input.id, userId: ctx.userId },
        });
        if (!component) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        // File extension validation - more permissive for setups
        const isSetup = input.type === "setup" || component.type === "setup";
        const componentAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html"];
        const setupAllowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html", ".json", ".md", ".env", ".yml", ".yaml", ".toml", ".prisma"];
        const allowed = isSetup ? setupAllowed : componentAllowed;
        
        if (input.files) {
          if (
            !input.files.every((f) =>
              allowed.some((ext) => f.filename.endsWith(ext)) || f.filename.includes(".")
            )
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid files or file types",
            });
          }
          if (
            input.mainFile &&
            !input.files.find((f) => f.filename === input.mainFile)
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "mainFile not present in files",
            });
          }
        }

        await ctx.prisma.component.update({
          where: { id: input.id },
          data: {
            mainFile: input.mainFile ?? component.mainFile,
            description: input.description ?? component.description,
            type: input.type ?? component.type,
            tags: input.tags ?? component.tags,
            dependencies: input.dependencies ?? component.dependencies,
            devDependencies: input.devDependencies ?? component.devDependencies,
            registryDependencies: input.registryDependencies ?? component.registryDependencies,
            installCommand: input.installCommand !== undefined ? input.installCommand : component.installCommand,
            isPublic: input.isPublic ?? component.isPublic,
          },
        });

        if (input.files) {
          await ctx.prisma.file.deleteMany({
            where: { componentId: input.id },
          });
          await ctx.prisma.file.createMany({
            data: input.files.map((f) => ({
              componentId: input.id,
              filename: f.filename,
              code: f.code,
            })),
          });
        }

        const updated = await ctx.prisma.component.findUnique({
          where: { id: input.id },
          include: { files: true, metrics: true },
        });

        return updated;
      }),

    // Delete component
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        try {
          await ctx.prisma.component.delete({
            where: { id: input.id, userId: ctx.userId },
          });
          return { success: true };
        } catch {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
      }),

    // Check alias availability
    checkAlias: protectedProcedure
      .input(z.object({ alias: z.string() }))
      .query(async ({ ctx, input }) => {
        const normalized = input.alias
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
        const exists = await ctx.prisma.component.findFirst({
          where: { alias: normalized, userId: ctx.userId },
        });
        return { available: !exists };
      }),

    // Fetch components by aliases (public, for CLI)
    fetch: baseProcedure
      .input(z.array(z.string()))
      .mutation(async ({ ctx, input }) => {
        const aliases = input.filter((a) => typeof a === "string");
        if (aliases.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No valid aliases provided.",
          });
        }

        const components = await ctx.prisma.component.findMany({
          where: { alias: { in: aliases } },
        });

        const compMap = new Map();
        for (const comp of components) compMap.set(comp.alias, comp);

        const result = aliases.map((alias) => {
          if (compMap.has(alias)) {
            const comp = compMap.get(alias);
            let dependent = comp.dependent;
            if (typeof dependent === "string") {
              try {
                dependent = JSON.parse(dependent);
              } catch {}
            }
            return { ...comp, dependent };
          }
          return { alias, error: "doesnot exist" };
        });

        return result;
      }),

    // Add component (public, for CLI with token)
    add: baseProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          type: z.enum(["component", "setup"]).default("component"),
          tags: z.array(z.string()).optional(),
          dependencies: z.array(z.string()).optional(),
          devDependencies: z.array(z.string()).optional(),
          registryDependencies: z.array(z.string()).optional(),
          installCommand: z.string().optional(),
          code: z.array(
            z.object({
              filename: z.string(),
              code: z.string(),
            }),
          ),
          token: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        let user = null;
        if (input.token) {
          user = await ctx.prisma.user.findUnique({
            where: { authToken: input.token },
          });
        }

        if (!user) {
          user = await ctx.prisma.user.findUnique({
            where: { email: "public@ashish.services" },
          });
          if (!user) {
            user = await ctx.prisma.user.create({
              data: {
                email: "public@ashish.services",
                name: "Public User",
                emailVerified: false,
                username: "public",
              },
            });
          }
        }

        const username = user.username || "public";
        const normalized = input.name.trim().toLowerCase().replace(/\s+/g, "-");
        const fullAlias = `@${username}/${normalized}`;

        const component = await ctx.prisma.component.findFirst({
          where: { alias: fullAlias },
        });

        if (component) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Alias '${fullAlias}' is already taken.`,
          });
        }

        // Determine mainFile from code array (first file or one named index)
        const mainFile =
          input.code.find((f: any) => f.filename.includes("index"))?.filename ||
          input.code[0]?.filename ||
          "index.tsx";

        const newComponent = await ctx.prisma.component.create({
          data: {
            alias: fullAlias,
            description: input.description || "",
            type: input.type,
            tags: input.tags || [],
            dependencies: input.dependencies || [],
            devDependencies: input.devDependencies || [],
            registryDependencies: input.registryDependencies || [],
            installCommand: input.installCommand || null,
            isPublic: true,
            mainFile,
            userId: user.id,
            files: {
              create: input.code.map((f: any) => ({
                filename: f.filename,
                code: f.code,
              })),
            },
          },
          include: { files: true },
        });

        return newComponent;
      }),

    // Validate token (for CLI)
    validateToken: baseProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findUnique({
          where: { authToken: input.token },
        });
        return { valid: !!user };
      }),
  }),

  // Username
  username: createTRPCRouter({
    // Get current username
    get: protectedProcedure.query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user) {
        return {
          success: false,
          msg: "User not in db",
          username: "",
        };
      }

      if (!user.username) {
        return {
          success: true,
          msg: "Username not set",
          username: "",
        };
      }

      return {
        success: true,
        msg: "Username set",
        username: user.username,
      };
    }),

    // Check username availability
    check: baseProcedure
      .input(z.object({ username: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!input.username || input.username.length < 3) {
          return { available: false };
        }
        const normalized = input.username.trim().toLowerCase();
        const exists = await ctx.prisma.user.findFirst({
          where: { username: normalized },
        });
        return { available: !exists };
      }),

    // Set username
    set: protectedProcedure
      .input(z.object({ username: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const usernameExists = await ctx.prisma.user.findUnique({
          where: { id: ctx.userId },
        });

        if (usernameExists?.username) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists",
          });
        }

        if (!input.username || input.username.length < 3) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username too short",
          });
        }

        const normalized = input.username.trim().toLowerCase();
        const exists = await ctx.prisma.user.findFirst({
          where: { username: normalized },
        });

        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already taken",
          });
        }

        const user = await ctx.prisma.user.update({
          where: { id: ctx.userId },
          data: { username: normalized },
        });

        return user;
      }),
  }),

  // User
  user: createTRPCRouter({
    // Get or create auth token
    getToken: protectedProcedure.mutation(async ({ ctx }) => {
      const dbUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find user in db",
        });
      }

      if (dbUser.authToken) {
        return { success: true, token: dbUser.authToken };
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          authToken: crypto.randomUUID(),
        },
      });

      return {
        success: true,
        token: updatedUser.authToken,
      };
    }),
    // Active sessions (read-only)
    sessions: protectedProcedure.query(async ({ ctx }) => {
      const sessions = await ctx.prisma.session.findMany({
        where: { userId: ctx.userId },
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          ipAddress: true,
          userAgent: true,
        },
      });
      return sessions;
    }),

    // Feedback
    feedback: createTRPCRouter({
      // Get all feedbacks
      list: baseProcedure.query(async ({ ctx }) => {
        const feedbacks = await ctx.prisma.feedback.findMany({
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, image: true, id: true } } },
        });
        return feedbacks.map((fb: any) => ({
          ...fb,
          user: fb.isAnonymous ? null : fb.user,
        }));
      }),

      // Create feedback
      create: baseProcedure
        .input(
          z.object({
            content: z.string(),
            rating: z.number().min(1).max(4),
            isAnonymous: z.boolean().optional(),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          if (!input.content || input.rating < 1 || input.rating > 4) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid input",
            });
          }

          if (!ctx.session && !input.isAnonymous) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Sign in required",
            });
          }

          const feedback = await ctx.prisma.feedback.create({
            data: {
              content: input.content,
              rating: input.rating,
              isAnonymous: !!input.isAnonymous,
              userId:
                !input.isAnonymous && ctx.session?.user?.id
                  ? ctx.session.user.id
                  : null,
            },
          });

          return feedback;
        }),
    }),
  }),

  // AI
  ai: createTRPCRouter({
    generate: baseProcedure
      .input(
        z.object({
          prompt: z.string(),
          files: z.array(z.any()).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        if (!input.prompt) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "prompt required",
          });
        }

        // Stub: echo back a simple component based on prompt
        const name = (
          input.prompt.match(/[A-Za-z]+/g)?.join("") || "Generated"
        ).slice(0, 20);
        const code = `import React from 'react';\nexport default function ${name}(){\n  return (<div style={{padding:12}}>${input.prompt.replace(
          /`/g,
          "`",
        )}</div>);\n}`;

        const out = [{ filename: "index.tsx", code }];

        return { files: out };
      }),
  }),

  // Get environment variables (for OAuth)
  getEnv: baseProcedure.query(async () => {
    return {
      Google: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
      Github: {
        id: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET,
      },
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
