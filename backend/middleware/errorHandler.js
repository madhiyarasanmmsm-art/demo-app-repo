import multer from "multer";

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Resume PDF must be 5 MB or smaller." });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  return res.status(status).json({
    error: status >= 500 ? "Failed to analyze the resume." : err.message,
  });
}
