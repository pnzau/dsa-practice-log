import { test } from "node:test";
import assert from "node:assert/strict";

function lengthOfLongestSubstring(s: string): number {
  const seen: Set<string> = new Set();
  let longestSubstring = 0;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    while (seen.has(char!)) {
      const [firstItem] = seen;
      seen.delete(firstItem!);
    }

    seen.add(char!);
    longestSubstring = Math.max(longestSubstring, seen.size);
  }
  return longestSubstring;
}

test("returns the correct values", () => {
  assert.deepEqual(lengthOfLongestSubstring("abcabcbb"), 3);
  assert.deepEqual(lengthOfLongestSubstring("bbbbb"), 1);
  assert.deepEqual(lengthOfLongestSubstring("pwwkew"), 3);
  assert.deepEqual(lengthOfLongestSubstring(""), 0);
  assert.deepEqual(lengthOfLongestSubstring("dvdf"), 3);
  assert.deepEqual(lengthOfLongestSubstring("abba"), 2);
});
