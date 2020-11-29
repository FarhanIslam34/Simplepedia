export const sampleArticles = [
  {
    title: "Alpha Centauri",
    extract: "An alien diplomat with an enormous egg shaped head",
    edited: new Date("1972-01-29T18:00:40Z").toISOString(),
    id: 4,
  },
  {
    title: "Dominators",
    extract: "Galactic bullies with funny robot pals.",
    edited: new Date("1968-08-10T18:00:40Z").toISOString(),
    id: 16,
  },
  {
    title: "Cybermen",
    extract:
      "Once like us, they have now replaced all of their body parts with cybernetics",
    edited: new Date("1966-10-08T18:00:40Z").toISOString(),
    id: 7,
  },
  {
    title: "Autons",
    extract: "Plastic baddies driven by the Nestine consciousness",
    edited: new Date("1970-01-03T18:00:40Z").toISOString(),
    id: 42,
  },
  {
    title: "Daleks",
    extract: "Evil little pepperpots of death",
    edited: new Date("1963-12-21T18:00:40Z").toISOString(),
    id: 25,
  },
];

export const articlesForSection = (section) => {
  return sampleArticles.filter(
    (article) => article.title.charAt(0).toUpperCase() === section
  );
};

export const sampleSections = [
  ...new Set(
    sampleArticles.map((article) => article.title.charAt(0).toUpperCase())
  ),
].sort();
