import mammoth from "mammoth";

/**
 * Extracts raw text from a PDF file buffer.
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const pdf = require("pdf-parse");
    const data = await pdf(buffer);
    return data.text || "";
  } catch (error) {
    console.warn("Error parsing PDF binary, falling back to text extraction:", error);
    // Fallback: decode buffer as utf-8 string (helps with mock files)
    return buffer.toString("utf-8");
  }
}

/**
 * Extracts raw text from a DOCX file buffer.
 */
export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.warn("Error parsing DOCX binary, falling back to text extraction:", error);
    // Fallback: decode buffer as utf-8 string (helps with mock files)
    return buffer.toString("utf-8");
  }
}

/**
 * Helper to parse file buffers based on MIME type or file extension.
 */
export async function parseResume(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
  const isDocx = 
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
    fileName.endsWith(".docx");
    
  if (isDocx) {
    return parseDocx(buffer);
  } else {
    // Default to PDF
    return parsePdf(buffer);
  }
}
