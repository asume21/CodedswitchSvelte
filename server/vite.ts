import type { Express } from "express";
import { createServer } from "vite";
import express from "express";
import path from "path";

export async function setupVite(app: Express, server: any) {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve("client"),
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  const clientPath = path.resolve("dist/client");
  
  // Serve static files from the dist/client directory
  app.use(express.static(clientPath, {
    index: false, // Don't serve index.html for directories
    fallthrough: true, // Continue to next middleware if file not found
  }));
  
  // Handle client-side routing - return index.html for all non-API routes
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'), (err) => {
      if (err) {
        res.status(500).send('Error loading the application');
      }
    });
  });
}

export function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}
