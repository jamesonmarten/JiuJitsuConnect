import { storage } from "./storage";
import { InsertProfile } from "@shared/schema";

const famousMMAMembers = [
  {
    user: {
      id: "conor-mcgregor",
      email: "conor.mcgregor@grapplr.com",
      firstName: "Conor",
      lastName: "McGregor",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "SBG Orlando",
      location: "Winter Park, FL",
      beltRank: "brown",
      bio: "Former two-division UFC champion. Teaching the art of precision striking and ground game.",
      trainingGoals: "Share knowledge and build champions",
      availability: "weekends",
      phone: "(407) 555-0101",
      isActive: true,
    }
  },
  {
    user: {
      id: "jon-jones",
      email: "jon.jones@grapplr.com",
      firstName: "Jon",
      lastName: "Jones",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "Jackson Wink Orlando",
      location: "Longwood, FL",
      beltRank: "black",
      bio: "UFC Light Heavyweight legend. Specializing in wrestling and submission defense.",
      trainingGoals: "Perfect technique and mental toughness",
      availability: "evenings",
      phone: "(407) 555-0102",
      isActive: true,
    }
  },
  {
    user: {
      id: "amanda-nunes",
      email: "amanda.nunes@grapplr.com",
      firstName: "Amanda",
      lastName: "Nunes",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "American Top Team Orlando",
      location: "Orlando, FL",
      beltRank: "black",
      bio: "The Lioness. Two-division UFC champion teaching power striking and ground control.",
      trainingGoals: "Develop complete fighters",
      availability: "mornings",
      phone: "(407) 555-0103",
      isActive: true,
    }
  },
  {
    user: {
      id: "daniel-cormier",
      email: "daniel.cormier@grapplr.com",
      firstName: "Daniel",
      lastName: "Cormier",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "Team Quest Orlando",
      location: "Altamonte Springs, FL",
      beltRank: "black",
      bio: "DC. Former two-division UFC champion. Wrestling and cage control specialist.",
      trainingGoals: "Build mental and physical strength",
      availability: "flexible",
      phone: "(407) 555-0104",
      isActive: true,
    }
  },
  {
    user: {
      id: "khabib-nurmagomedov",
      email: "khabib.nurmagomedov@grapplr.com",
      firstName: "Khabib",
      lastName: "Nurmagomedov",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "Eagles MMA Orlando",
      location: "Lake Mary, FL",
      beltRank: "black",
      bio: "The Eagle. Undefeated UFC champion. Sambo and ground control master.",
      trainingGoals: "Discipline and domination",
      availability: "mornings",
      phone: "(407) 555-0105",
      isActive: true,
    }
  },
  {
    user: {
      id: "israel-adesanya",
      email: "israel.adesanya@grapplr.com",
      firstName: "Israel",
      lastName: "Adesanya",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "City Kickboxing Orlando",
      location: "Orlando, FL",
      beltRank: "purple",
      bio: "The Last Stylebender. UFC Middleweight champion. Striking and movement specialist.",
      trainingGoals: "Perfect the art of combat",
      availability: "evenings",
      phone: "(407) 555-0106",
      isActive: true,
    }
  },
  {
    user: {
      id: "valentina-shevchenko",
      email: "valentina.shevchenko@grapplr.com",
      firstName: "Valentina",
      lastName: "Shevchenko",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "Tiger Muay Thai Orlando",
      location: "Winter Springs, FL",
      beltRank: "brown",
      bio: "Bullet. UFC Flyweight champion. Muay Thai and precision striking expert.",
      trainingGoals: "Technical perfection",
      availability: "weekends",
      phone: "(407) 555-0107",
      isActive: true,
    }
  },
  {
    user: {
      id: "dustin-poirier",
      email: "dustin.poirier@grapplr.com",
      firstName: "Dustin",
      lastName: "Poirier",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "American Top Team Orlando",
      location: "Sanford, FL",
      beltRank: "brown",
      bio: "The Diamond. UFC veteran with knockout power. Boxing and heart.",
      trainingGoals: "Stay sharp and help others",
      availability: "flexible",
      phone: "(407) 555-0108",
      isActive: true,
    }
  },
  {
    user: {
      id: "jorge-masvidal",
      email: "jorge.masvidal@grapplr.com",
      firstName: "Jorge",
      lastName: "Masvidal",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "ATT Orlando",
      location: "Orlando, FL",
      beltRank: "brown",
      bio: "Gamebred. Street fighting legend turned UFC star. Raw striking power.",
      trainingGoals: "Keep it real, keep it street",
      availability: "evenings",
      phone: "(407) 555-0109",
      isActive: true,
    }
  },
  {
    user: {
      id: "rose-namajunas",
      email: "rose.namajunas@grapplr.com",
      firstName: "Rose",
      lastName: "Namajunas",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "Roufusport Orlando",
      location: "Longwood, FL",
      beltRank: "brown",
      bio: "Thug Rose. Former UFC Strawweight champion. Technical striking and flow.",
      trainingGoals: "Mental clarity and technique",
      availability: "mornings",
      phone: "(407) 555-0110",
      isActive: true,
    }
  },
  {
    user: {
      id: "colby-covington",
      email: "colby.covington@grapplr.com",
      firstName: "Colby",
      lastName: "Covington",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "MMA Masters Orlando",
      location: "Orlando, FL",
      beltRank: "brown",
      bio: "Chaos. UFC Welterweight contender. Relentless pressure and cardio.",
      trainingGoals: "Outwork everyone",
      availability: "all day",
      phone: "(407) 555-0111",
      isActive: true,
    }
  },
  {
    user: {
      id: "derrick-lewis",
      email: "derrick.lewis@grapplr.com",
      firstName: "Derrick",
      lastName: "Lewis",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "Fortis MMA Orlando",
      location: "Casselberry, FL",
      beltRank: "purple",
      bio: "The Black Beast. UFC Heavyweight knockout artist. Raw power and heart.",
      trainingGoals: "Swang and bang",
      availability: "afternoons",
      phone: "(407) 555-0112",
      isActive: true,
    }
  },
  {
    user: {
      id: "stephen-wonderboy",
      email: "stephen.wonderboy@grapplr.com",
      firstName: "Stephen",
      lastName: "Thompson",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "Upstate Karate Orlando",
      location: "Oviedo, FL",
      beltRank: "purple",
      bio: "Wonderboy. UFC Welterweight striker. Karate and point fighting precision.",
      trainingGoals: "Perfect distance and timing",
      availability: "evenings",
      phone: "(407) 555-0113",
      isActive: true,
    }
  },
  {
    user: {
      id: "holly-holm",
      email: "holly.holm@grapplr.com",
      firstName: "Holly",
      lastName: "Holm",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "Jackson Wink Orlando",
      location: "Winter Garden, FL",
      beltRank: "purple",
      bio: "The Preacher's Daughter. Former UFC Bantamweight champion. Boxing precision.",
      trainingGoals: "Stay technical and sharp",
      availability: "mornings",
      phone: "(407) 555-0114",
      isActive: true,
    }
  },
  {
    user: {
      id: "nate-diaz",
      email: "nate.diaz@grapplr.com",
      firstName: "Nate",
      lastName: "Diaz",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "Team Diaz Orlando",
      location: "Orlando, FL",
      beltRank: "brown",
      bio: "209. UFC veteran with legendary cardio. Boxing and Brazilian Jiu-Jitsu.",
      trainingGoals: "Stay ready, stay real",
      availability: "whenever",
      phone: "(407) 555-0115",
      isActive: true,
    }
  },
  {
    user: {
      id: "tony-ferguson",
      email: "tony.ferguson@grapplr.com",
      firstName: "Tony",
      lastName: "Ferguson",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "intermediate" as const,
      gymAffiliation: "10th Planet Orlando",
      location: "Apopka, FL",
      beltRank: "brown",
      bio: "El Cucuy. UFC lightweight warrior. Unorthodox striking and submissions.",
      trainingGoals: "Mental warfare and conditioning",
      availability: "late nights",
      phone: "(407) 555-0116",
      isActive: true,
    }
  },
  {
    user: {
      id: "michelle-waterson",
      email: "michelle.waterson@grapplr.com",
      firstName: "Michelle",
      lastName: "Waterson",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "intermediate" as const,
      gymAffiliation: "Jackson Wink Orlando",
      location: "Maitland, FL",
      beltRank: "purple",
      bio: "The Karate Hottie. UFC Strawweight. Karate and wrestling combinations.",
      trainingGoals: "Balance and technique",
      availability: "mornings",
      phone: "(407) 555-0117",
      isActive: true,
    }
  },
  {
    user: {
      id: "donald-cerrone",
      email: "donald.cerrone@grapplr.com",
      firstName: "Donald",
      lastName: "Cerrone",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "intermediate" as const,
      gymAffiliation: "BMF Ranch Orlando",
      location: "Mount Dora, FL",
      beltRank: "brown",
      bio: "Cowboy. UFC legend with most finishes. Muay Thai and submission hunting.",
      trainingGoals: "Always stay active",
      availability: "anytime",
      phone: "(407) 555-0118",
      isActive: true,
    }
  },
  {
    user: {
      id: "charles-oliveira",
      email: "charles.oliveira@grapplr.com",
      firstName: "Charles",
      lastName: "Oliveira",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "intermediate" as const,
      gymAffiliation: "Chute Boxe Orlando",
      location: "Clermont, FL",
      beltRank: "black",
      bio: "Do Bronx. Former UFC Lightweight champion. Submission specialist.",
      trainingGoals: "Finish fights, show heart",
      availability: "afternoons",
      phone: "(407) 555-0119",
      isActive: true,
    }
  },
  {
    user: {
      id: "miesha-tate",
      email: "miesha.tate@grapplr.com",
      firstName: "Miesha",
      lastName: "Tate",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "beginner" as const,
      gymAffiliation: "Xtreme Couture Orlando",
      location: "DeLand, FL",
      beltRank: "purple",
      bio: "Cupcake. Former UFC Bantamweight champion. Wrestling and determination.",
      trainingGoals: "Stay in fighting shape",
      availability: "weekends",
      phone: "(407) 555-0120",
      isActive: true,
    }
  },
  // Wisconsin/Milwaukee Area Members
  {
    user: {
      id: "milwaukee-mike",
      email: "milwaukee.mike@grapplr.com",
      firstName: "Mike",
      lastName: "Mueller",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "Roufusport Milwaukee",
      location: "Milwaukee, WI",
      beltRank: "black",
      bio: "Local Milwaukee instructor specializing in kickboxing and Brazilian Jiu-Jitsu.",
      trainingGoals: "Build a strong community of fighters",
      availability: "evenings",
      phone: "(414) 555-0201",
      isActive: true,
    }
  },
  {
    user: {
      id: "wisconsin-warrior",
      email: "sarah.wisconsin@grapplr.com", 
      firstName: "Sarah",
      lastName: "Johnson",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "beginner" as const,
      gymAffiliation: "Green Bay Fight Club",
      location: "Green Bay, WI",
      beltRank: "white",
      bio: "New to MMA but eager to learn. Love training in the Wisconsin community.",
      trainingGoals: "Learn fundamentals and stay fit",
      availability: "mornings",
      phone: "(920) 555-0203",
      isActive: true,
    }
  },
  {
    user: {
      id: "milwaukee-maria",
      email: "maria.milwaukee@grapplr.com",
      firstName: "Maria",
      lastName: "Rodriguez",
      profileImageUrl: null,
    },
    profile: {
      role: "instructor" as const,
      skillLevel: "professional" as const,
      gymAffiliation: "Milwaukee MMA Academy",
      location: "Milwaukee, WI",
      beltRank: "black",
      bio: "Professional fighter and instructor. Teaching striking and ground game in Milwaukee.",
      trainingGoals: "Develop the next generation of fighters",
      availability: "all day",
      phone: "(414) 555-0204",
      isActive: true,
    }
  },
  {
    user: {
      id: "badger-bjj",
      email: "tom.badger@grapplr.com",
      firstName: "Tom",
      lastName: "Kowalski",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "advanced" as const,
      gymAffiliation: "Badger Brazilian Jiu-Jitsu",
      location: "Milwaukee, WI",
      beltRank: "brown",
      bio: "Brown belt in BJJ, active competitor in the Milwaukee area.",
      trainingGoals: "Train for competitions and teach others",
      availability: "evenings",
      phone: "(414) 555-0205",
      isActive: true,
    }
  },
  {
    user: {
      id: "kenosha-kevin",
      email: "kevin.kenosha@grapplr.com",
      firstName: "Kevin",
      lastName: "Anderson",
      profileImageUrl: null,
    },
    profile: {
      role: "member" as const,
      skillLevel: "intermediate" as const,
      gymAffiliation: "Kenosha Combat Club",
      location: "Kenosha, WI",
      beltRank: "blue",
      bio: "Training in Kenosha area, passionate about mixed martial arts.",
      trainingGoals: "Improve technique and conditioning",
      availability: "weekends",
      phone: "(262) 555-0206",
      isActive: true,
    }
  }
];

export async function seedMMAMembers() {
  console.log("Seeding MMA members...");
  
  for (const member of famousMMAMembers) {
    try {
      // Create user
      const user = await storage.upsertUser(member.user);
      
      // Create profile
      const profileData: InsertProfile = {
        userId: user.id,
        ...member.profile
      };
      
      await storage.createProfile(profileData);
      console.log(`✓ Created ${member.user.firstName} ${member.user.lastName}`);
    } catch (error) {
      console.error(`✗ Failed to create ${member.user.firstName} ${member.user.lastName}:`, error);
    }
  }
  
  console.log("MMA members seeding complete!");
}