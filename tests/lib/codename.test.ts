import { generateCodename } from "@/lib/codename";
import { adjectives, colors, animals } from "@/lib/wordSets";

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    const result = generateCodename();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("result is valid PascalCase with no spaces", () => {
    const result = generateCodename();
    expect(result).not.toContain(" ");
    // Each segment starts with an uppercase letter followed by lowercase letters
    expect(result).toMatch(/^([A-Z][a-z]+){3}$/);
  });

  it("is composed of exactly three capitalised words, one from each set", () => {
    const capitalize = (w: string) =>
      w.charAt(0).toUpperCase() + w.slice(1);

    const capitalizedAdjectives = adjectives.map(capitalize);
    const capitalizedColors = colors.map(capitalize);
    const capitalizedAnimals = animals.map(capitalize);

    for (let i = 0; i < 20; i++) {
      const result = generateCodename();

      const adjMatch = capitalizedAdjectives.find((w) =>
        result.startsWith(w)
      );
      expect(adjMatch).toBeDefined();

      const rest = result.slice(adjMatch!.length);
      const colorMatch = capitalizedColors.find((w) => rest.startsWith(w));
      expect(colorMatch).toBeDefined();

      const animal = rest.slice(colorMatch!.length);
      expect(capitalizedAnimals).toContain(animal);
    }
  });

  it("word sets have no overlapping entries", () => {
    const adjSet = new Set(adjectives);
    const colorSet = new Set(colors);
    const animalSet = new Set(animals);

    for (const word of adjSet) {
      expect(colorSet.has(word)).toBe(false);
      expect(animalSet.has(word)).toBe(false);
    }
    for (const word of colorSet) {
      expect(animalSet.has(word)).toBe(false);
    }
  });
});
