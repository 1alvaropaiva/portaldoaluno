const blacklist = new Map<string, number>();

function cleanup() {
  const now = Math.floor(Date.now() / 1000);
  for (const [token, exp] of blacklist.entries()) {
    if (exp <= now) {
      blacklist.delete(token);
    }
  }
}

export function addToBlacklist(token: string, exp?: number) {
  const fallbackExp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  blacklist.set(token, exp ?? fallbackExp);
  cleanup();
}

export function isBlacklisted(token: string): boolean {
  cleanup();
  return blacklist.has(token);
}
