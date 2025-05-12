import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

// Initialize the Express app
const app = express();

async function initializeApp() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Initialize routes
  const server = await registerRoutes(app);

  // Setup static file serving
  if (process.env.NODE_ENV === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server if not in Vercel environment
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const port = process.env.PORT || 5001;
    server.listen(port, () => {
      log(`Server running on port ${port}`);
    });
  }
}

// Initialize the app
initializeApp().catch(console.error);

export default app;
