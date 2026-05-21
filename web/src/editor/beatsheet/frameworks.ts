export interface Beat {
  id: string;
  name: string;
  description: string;
  targetPercent: number; // 0–100, position in the script as percentage
}

export interface Framework {
  id: string;
  name: string;
  author: string;
  description: string;
  beats: Beat[];
}

export const SAVE_THE_CAT: Framework = {
  id: "save_the_cat",
  name: "Save the Cat",
  author: "Blake Snyder",
  description: "15-beat structure for feature screenplays",
  beats: [
    {
      id: "opening_image",
      name: "Opening Image",
      description: "A snapshot of the world before the story begins.",
      targetPercent: 1,
    },
    {
      id: "theme_stated",
      name: "Theme Stated",
      description:
        "Something is said (often to the hero) that hints at the story's theme.",
      targetPercent: 5,
    },
    {
      id: "setup",
      name: "Setup",
      description: "Introduce the hero, their world, and what they're missing.",
      targetPercent: 10,
    },
    {
      id: "catalyst",
      name: "Catalyst",
      description: "The inciting incident. Life-changing event.",
      targetPercent: 11,
    },
    {
      id: "debate",
      name: "Debate",
      description: "The hero questions whether to take the journey.",
      targetPercent: 15,
    },
    {
      id: "break_into_two",
      name: "Break Into Two",
      description: "The hero commits. They enter a new world.",
      targetPercent: 22,
    },
    {
      id: "b_story",
      name: "B Story",
      description:
        "A subplot begins — often a relationship that carries the theme.",
      targetPercent: 25,
    },
    {
      id: "fun_and_games",
      name: "Fun and Games",
      description:
        'The "promise of the premise." What the audience came to see.',
      targetPercent: 35,
    },
    {
      id: "midpoint",
      name: "Midpoint",
      description: "A false victory or false defeat. Stakes are raised.",
      targetPercent: 50,
    },
    {
      id: "bad_guys_close_in",
      name: "Bad Guys Close In",
      description: "External and internal pressure mounts. Things get worse.",
      targetPercent: 62,
    },
    {
      id: "all_is_lost",
      name: "All Is Lost",
      description: 'The hero\'s lowest point. A "whiff of death."',
      targetPercent: 75,
    },
    {
      id: "dark_night_of_the_soul",
      name: "Dark Night of the Soul",
      description: "The hero faces despair. The world seems doomed.",
      targetPercent: 78,
    },
    {
      id: "break_into_three",
      name: "Break Into Three",
      description: "A new idea — usually from the B story — sparks a solution.",
      targetPercent: 82,
    },
    {
      id: "finale",
      name: "Finale",
      description: "The hero proves they've changed. Resolves conflict.",
      targetPercent: 90,
    },
    {
      id: "final_image",
      name: "Final Image",
      description: "Mirror of the opening image, showing transformation.",
      targetPercent: 99,
    },
  ],
};

export const THREE_ACT: Framework = {
  id: "three_act",
  name: "Three-Act Structure",
  author: "Classical",
  description: "Setup → Confrontation → Resolution",
  beats: [
    {
      id: "inciting_incident",
      name: "Inciting Incident",
      description: "The event that sets the story in motion.",
      targetPercent: 10,
    },
    {
      id: "plot_point_1",
      name: "Plot Point I",
      description: "The hero commits to the central conflict.",
      targetPercent: 25,
    },
    {
      id: "midpoint",
      name: "Midpoint",
      description: "A reversal that shifts the story's direction.",
      targetPercent: 50,
    },
    {
      id: "plot_point_2",
      name: "Plot Point II",
      description: "The hero hits their lowest point. Final push begins.",
      targetPercent: 75,
    },
    {
      id: "climax",
      name: "Climax",
      description: "The final confrontation. Hero proves their arc.",
      targetPercent: 90,
    },
    {
      id: "resolution",
      name: "Resolution",
      description: "The new normal. Aftermath.",
      targetPercent: 97,
    },
  ],
};

export const HEROS_JOURNEY: Framework = {
  id: "heros_journey",
  name: "Hero's Journey",
  author: "Christopher Vogler",
  description: "12-stage mythic structure",
  beats: [
    {
      id: "ordinary_world",
      name: "Ordinary World",
      description: "The hero's normal life before transformation.",
      targetPercent: 5,
    },
    {
      id: "call_to_adventure",
      name: "Call to Adventure",
      description: "A challenge or quest presents itself.",
      targetPercent: 10,
    },
    {
      id: "refusal",
      name: "Refusal of the Call",
      description: "The hero hesitates or refuses.",
      targetPercent: 15,
    },
    {
      id: "meeting_mentor",
      name: "Meeting the Mentor",
      description: "A guide appears with wisdom or tools.",
      targetPercent: 20,
    },
    {
      id: "crossing_threshold",
      name: "Crossing the Threshold",
      description: "The hero commits and enters the special world.",
      targetPercent: 25,
    },
    {
      id: "tests_allies",
      name: "Tests, Allies, Enemies",
      description: "The hero learns the new world's rules.",
      targetPercent: 38,
    },
    {
      id: "approach",
      name: "Approach to the Inmost Cave",
      description: "Preparation for the major challenge.",
      targetPercent: 48,
    },
    {
      id: "ordeal",
      name: "The Ordeal",
      description: "The hero confronts their greatest fear.",
      targetPercent: 55,
    },
    {
      id: "reward",
      name: "The Reward",
      description: "The hero seizes the prize.",
      targetPercent: 65,
    },
    {
      id: "road_back",
      name: "The Road Back",
      description: "The hero commits to returning home.",
      targetPercent: 75,
    },
    {
      id: "resurrection",
      name: "Resurrection",
      description: "A final test where the hero is reborn.",
      targetPercent: 88,
    },
    {
      id: "return",
      name: "Return with the Elixir",
      description: "The hero returns transformed.",
      targetPercent: 97,
    },
  ],
};

export const FRAMEWORKS: Framework[] = [SAVE_THE_CAT, THREE_ACT, HEROS_JOURNEY];

export function getFramework(id: string): Framework {
  return FRAMEWORKS.find((f) => f.id === id) ?? SAVE_THE_CAT;
}
