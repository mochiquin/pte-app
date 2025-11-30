-- Clean up existing questions (optional, helps avoid duplicates if run multiple times)
-- DELETE FROM questions; 

-- Insert Read Aloud (RA) Questions
INSERT INTO questions (type, title, content) VALUES
(
  'RA',
  'RA #1301 - Blue Whale',
  'Blue whales are the largest known animals to have ever lived on Earth. These magnificent marine mammals rule the oceans at up to 100 feet long and upwards of 200 tons. Their tongues alone can weigh as much as an elephant. Their hearts, as much as an automobile.'
),
(
  'RA',
  'RA #1302 - Botanic Gardens',
  'Botanic gardens are scientific and cultural institutions established to collect, study, exchange and display plants for research and for the education and enjoyment of the public. There are about 1775 botanic gardens and arboreta in 148 countries around the world with many more under construction or being planned.'
),
(
  'RA',
  'RA #1303 - Akimbo',
  'Akimbo, this must be one of the odder-looking words in the language and puzzles us in part because it doesn''t seem to have any relatives. What''s more, it is now virtually a fossil word, until recently almost invariably found in arms akimbo, a posture in which a person stands with hands on hips and elbows sharply bent outward, one signaling impatience, hostility, or contempt.'
),
(
  'RA',
  'RA #1304 - Lincoln',
  'Lincoln''s apparently radical change of mind about his war power to emancipate slaves was caused by the escalating scope of war, which convinced him that any measure to weaken the Confederacy and strengthen the Union war effort was justifiable as a military necessity.'
),
(
  'RA',
  'RA #1305 - Teslas',
  'Tesla''s theoretical work formed the basis of modern alternating current electric power systems. Thomas Edison promised him almost one million dollars in today''s money to undertake motor and generator improvement. However, when Tesla asked about the money, Edison''s reply was: "Tesla, you don''t understand our American humor."'
);

-- Insert Describe Image (DI) Questions (using placeholder images for now)
INSERT INTO questions (type, title, image_url) VALUES
(
  'DI',
  'DI #201 - Global Population Growth',
  'https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&w=800&q=80' 
),
(
  'DI',
  'DI #202 - Rainfall in London',
  'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80'
);

