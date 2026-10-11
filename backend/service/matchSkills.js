// Deterministic placeholder until the AI scoring stage is added.
const STOPWORDS = new Set(`
  a an and are as at be but by can could for from has have how i in is it its may might must of on or our so than that the their them then there these they this to was we were what when where which while who will with would you your
  about across after all also any before being both each etc every few get got here if into job just least less like many more most need new not off once one only other others out over own part per please same some such take under until up via very well within without
  apply application benefits candidate candidates college company contact day degree education email experience experienced full great hours hybrid looking master office onsite phone position preferred remote requirement requirements salary senior strong team teams university work working works year years
  developer engineer engineers skills nice good must should plus ideal proficient proficiency familiarity knowledge understanding ability excellent required seeking hire hiring responsibilities role roles
`.split(/\s+/));

export function matchSkills(resumeText, jdText) {
  const resume = resumeText.toLowerCase();
  const terms = jdText.toLowerCase()
    .split(/[^a-z0-9+#./]+/)
    .map((term) => term.replace(/\.+$/, ""))
    .filter((term) => term.length >= 2 && !STOPWORDS.has(term))
    .filter(isLikelySkillTerm);

  const matched = [];
  const missing = [];
  for (const term of terms) {
    const skill = prettyTerm(term);
    if (resume.includes(term)) {
      if (!matched.includes(skill)) matched.push(skill);
    } else if (!missing.includes(skill)) {
      missing.push(skill);
    }
  }
  return { matched, missing };
}

function isLikelySkillTerm(term) {
  if (!/[a-z]/.test(term)) return false;
  if (/[0-9+#./]/.test(term)) return true;
  return term.length >= 3;
}

function prettyTerm(term) {
  return term.split(/([./])/)
    .map((part) => (/[a-z]/.test(part) ? part[0].toUpperCase() + part.slice(1) : part))
    .join("");
}
