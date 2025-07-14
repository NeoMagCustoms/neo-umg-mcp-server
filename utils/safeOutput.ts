// utils/safeOutput.ts

export function safeOutput(data: any): any {
  const redactKeys = ['vault', 'AlignmentBlock', 'apiKey', 'OPENAI_API_KEY'];

  const traverse = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(traverse);
    }

    if (typeof obj === 'object' && obj !== null) {
      const redacted: Record<string, any> = {};

      for (const key in obj) {
        if (redactKeys.includes(key)) {
          redacted[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          redacted[key] = traverse(obj[key]);
        } else {
          redacted[key] = obj[key];
        }
      }

      return redacted;
    }

    return obj;
  };

  return traverse(data);
}
