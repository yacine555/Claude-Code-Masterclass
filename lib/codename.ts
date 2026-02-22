import { adjectives, colors, animals } from "./wordSets";

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCodename(): string {
  return (
    capitalize(pick(adjectives)) +
    capitalize(pick(colors)) +
    capitalize(pick(animals))
  );
}
