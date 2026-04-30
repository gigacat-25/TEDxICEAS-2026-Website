import { getDb } from '../src/db/index';
import { speakers, sponsors, teamMembers } from '../src/db/schema';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  const db = getDb();
  console.log('Seeding database...');

  // 1. Speakers
  const speakerData = [
    { name: "Dr. Alice Abraham", role: "Keynote Speaker", bio: "Renowned expert in educational leadership and innovation." },
    { name: "Dr. M A Saleem", role: "Public Policy Expert", bio: "Specialist in urban governance and community development." },
    { name: "Dr. Bharath Bylappa", role: "Technology Visionary", bio: "Leading researcher in AI and its societal impacts." },
    { name: "Rida Khan", role: "Creative Storyteller", bio: "Award-winning filmmaker and advocate for visual narratives." },
    { name: "Prahalad Kulkarni", role: "Sustainable Architect", bio: "Pioneer in eco-friendly design and urban planning." },
  ];

  for (const s of speakerData) {
    await db.insert(speakers).values({
      id: uuidv4(),
      name: s.name,
      role: s.role,
      bio: s.bio,
      imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}`,
      displayOrder: speakerData.indexOf(s),
    }).onConflictDoNothing();
  }
  console.log('Speakers seeded.');

  // 2. Team Members
  const teamData = [
    { name: "John Doe", role: "Lead Organizer", teamGroup: "core" },
    { name: "Jane Smith", role: "Technical Lead", teamGroup: "technical" },
    { name: "Alice Johnson", role: "Design Lead", teamGroup: "design" },
    { name: "Bob Wilson", role: "Marketing Head", teamGroup: "marketing" },
  ];

  for (const t of teamData) {
    await db.insert(teamMembers).values({
      id: uuidv4(),
      name: t.name,
      role: t.role,
      teamGroup: t.teamGroup,
      imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`,
      displayOrder: teamData.indexOf(t),
    }).onConflictDoNothing();
  }
  console.log('Team members seeded.');

  // 3. Sponsors
  const sponsorData = [
    { name: "Cloudflare", tier: "platinum", websiteUrl: "https://cloudflare.com", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg" },
    { name: "Google", tier: "gold", websiteUrl: "https://google.com", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  ];

  for (const sp of sponsorData) {
    await db.insert(sponsors).values({
      id: uuidv4(),
      name: sp.name,
      tier: sp.tier,
      websiteUrl: sp.websiteUrl,
      logoUrl: sp.logoUrl,
      displayOrder: sponsorData.indexOf(sp),
    }).onConflictDoNothing();
  }
  console.log('Sponsors seeded.');

  console.log('Seeding complete!');
}

seed().catch(console.error);
