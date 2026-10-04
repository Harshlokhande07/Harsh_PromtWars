import { describe, it, expect } from "vitest";
import { checkSafety } from "../lib/safety";

describe("Safety Guard Tests", () => {
  it("detects self-harm expressions in English and Hinglish", () => {
    const triggers = [
      "I want to die",
      "I am thinking of committing suicide because of this debt",
      "I want to kill myself",
      "Going to end my life if this doesn't work out",
      "Mujhe aatmahatya karne ka man kar raha hai",
      "mar jaana chahta hoon",
      "jeena nahi chahta ab",
      "marne ka man ho raha hai",
      "Ab jeene ka koi fayda nahi lag raha",
    ];

    for (const text of triggers) {
      const result = checkSafety(text);
      expect(result).not.toBeNull();
      expect(result?.isSafetyTrigger).toBe(true);
      expect(result?.category).toBe("self_harm");
      expect(result?.helplines.length).toBeGreaterThan(0);
      // Ensure Tele-MANAS helpline is included with tel link
      const teleManas = result?.helplines.find((h) => h.contact.includes("14416"));
      expect(teleManas).toBeDefined();
      expect(teleManas?.tel).toBe("tel:14416");
    }
  });

  it("detects urgent medical and domestic abuse emergencies", () => {
    const medical = checkSafety("Having crushing chest pain and difficulty breathing");
    expect(medical).not.toBeNull();
    expect(medical?.category).toBe("medical");

    const abuse = checkSafety("Being beaten at home by partner and locked in a room");
    expect(abuse).not.toBeNull();
    expect(abuse?.category).toBe("abuse");
  });

  it("does NOT false-trigger on common benign idioms and normal decision phrases", () => {
    const benignPhrases = [
      "I am killing it at work with this new product launch",
      "I am dying to try this new startup role",
      "Just killing time between interviews",
      "I am dead tired after a 60 hour work week at the bank",
      "These project deadlines are killing me, need to manage time",
      "Shooting for a promotion by next quarter",
      "Ready to take a shot at starting my own company",
      "Bite the bullet and take the exam",
    ];

    for (const text of benignPhrases) {
      const result = checkSafety(text);
      expect(result).toBeNull();
    }
  });
});
