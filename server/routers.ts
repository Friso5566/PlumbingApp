import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  plumbing: router({
    askQuestion: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.question !== "string") throw new Error("question must be string");
        return { question: obj.question };
      })
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const { buildSystemPrompt } = await import("./regionPrompts");
        const { getUserRegion } = await import("./db");
        
        const region = await getUserRegion(ctx.user.id);
        const systemPrompt = buildSystemPrompt(region, false);
        
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: input.question,
            },
          ],
        });

        const content = response.choices[0]?.message?.content;
        const responseText = typeof content === "string" ? content : "";
        
        const { createPlumbingQuery } = await import("./db");
        await createPlumbingQuery({
          userId: ctx.user.id,
          queryType: "text",
          queryText: input.question,
          response: responseText,
          region,
        });

        return { response: responseText };
      }),

    analyzeImage: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.imageUrl !== "string") throw new Error("imageUrl must be string");
        if (obj.question && typeof obj.question !== "string") throw new Error("question must be string");
        return { imageUrl: obj.imageUrl, question: (obj.question as string) || "" };
      })
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const { buildSystemPrompt } = await import("./regionPrompts");
        const { getUserRegion } = await import("./db");
        
        const region = await getUserRegion(ctx.user.id);
        const systemPrompt = buildSystemPrompt(region, true);
        
        const userPrompt = input.question
          ? `Analyze this plumbing image and answer: ${input.question}`
          : `Analyze this plumbing image. Identify any issues, components, or problems visible. Provide professional diagnosis and recommendations for repair or maintenance.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: input.imageUrl,
                    detail: "high",
                  },
                },
                {
                  type: "text",
                  text: userPrompt,
                },
              ],
            },
          ],
        });

        const content = response.choices[0]?.message?.content;
        const responseText = typeof content === "string" ? content : "";
        
        const { createPlumbingQuery } = await import("./db");
        await createPlumbingQuery({
          userId: ctx.user.id,
          queryType: "image",
          queryText: input.question,
          imageUrl: input.imageUrl,
          response: responseText,
          region,
        });

        return { response: responseText };
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPlumbingQueries } = await import("./db");
      return getUserPlumbingQueries(ctx.user.id);
    }),

    uploadImage: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.base64 !== "string") throw new Error("base64 must be string");
        if (typeof obj.fileName !== "string") throw new Error("fileName must be string");
        return { base64: obj.base64, fileName: obj.fileName };
      })
      .mutation(async ({ ctx, input }) => {
        const { uploadImageToStorage } = await import("./uploadHandler");
        
        const buffer = Buffer.from(input.base64, "base64");
        const url = await uploadImageToStorage(
          ctx.user.id,
          buffer,
          input.fileName,
          "image/jpeg"
        );

        return { url };
      }),

    getRegion: protectedProcedure.query(async ({ ctx }) => {
      const { getUserRegion } = await import("./db");
      const region = await getUserRegion(ctx.user.id);
      return { region };
    }),

    setRegion: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.region !== "string") throw new Error("region must be string");
        return { region: obj.region };
      })
      .mutation(async ({ ctx, input }) => {
        const { updateUserRegion } = await import("./db");
        await updateUserRegion(ctx.user.id, input.region as any);
        return { success: true };
      }),

    sendReportEmail: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.recipientEmail !== "string") throw new Error("recipientEmail must be string");
        if (typeof obj.reportType !== "string") throw new Error("reportType must be string");
        if (typeof obj.companyName !== "string") throw new Error("companyName must be string");
        if (typeof obj.clientName !== "string") throw new Error("clientName must be string");
        if (typeof obj.referenceNumber !== "string") throw new Error("referenceNumber must be string");
        if (obj.pdfBuffer && typeof obj.pdfBuffer !== "string") throw new Error("pdfBuffer must be string (base64)");
        return {
          recipientEmail: obj.recipientEmail,
          reportType: obj.reportType as "inspection" | "quote",
          companyName: obj.companyName,
          clientName: obj.clientName,
          referenceNumber: obj.referenceNumber,
          message: typeof obj.message === "string" ? obj.message : "",
          pdfBuffer: typeof obj.pdfBuffer === "string" ? obj.pdfBuffer : null,
        };
      })
      .mutation(async ({ ctx, input }) => {
        const { sendEmail, generateReportEmailHTML } = await import("./emailService");
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.recipientEmail)) {
          throw new Error("Invalid email address");
        }

        // Generate email HTML
        const emailHTML = generateReportEmailHTML(
          input.reportType,
          input.companyName,
          input.clientName,
          input.referenceNumber
        );

        // Add custom message if provided
        const finalHTML = input.message
          ? emailHTML.replace(
              "<p>If you have any questions",
              `<p><strong>Additional Message:</strong></p><p>${input.message}</p><p>If you have any questions`
            )
          : emailHTML;

        // Prepare attachments
        const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];
        if (input.pdfBuffer) {
          attachments.push({
            filename: `${input.reportType}-report-${input.referenceNumber}.pdf`,
            content: Buffer.from(input.pdfBuffer, "base64"),
            contentType: "application/pdf",
          });
        }

        // Send email
        const result = await sendEmail({
          to: input.recipientEmail,
          subject: `${input.reportType === "inspection" ? "Plumbing Inspection" : "Plumbing Quote"} Report - Ref: ${input.referenceNumber}`,
          html: finalHTML,
          attachments,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to send email");
        }

        return { success: true, messageId: result.messageId };
      }),
  }),
});

export type AppRouter = typeof appRouter;
