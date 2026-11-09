import { test } from "node:test";
import assert from "node:assert/strict";

function lengthOfLongestSubstring(s: string): number {
  const seen: Set<string> = new Set();
  let left = 0;
  let longestSubstring = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right]!;
    while (seen.has(char)) {
      seen.delete(s[left]!);
      left++;
    }

    seen.add(char);
    longestSubstring = Math.max(longestSubstring, right - left + 1);
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
