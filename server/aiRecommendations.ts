import OpenAI from "openai";
import { UserWithProfile } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TrainingPartnerRecommendation {
  user: UserWithProfile;
  compatibilityScore: number;
  reasons: string[];
  suggestedTrainingActivities: string[];
}

export interface RecommendationCriteria {
  currentUser: UserWithProfile;
  availablePartners: UserWithProfile[];
  maxRecommendations?: number;
  preferredSkillLevels?: string[];
  preferredRoles?: string[];
  locationRadius?: number;
}

export async function generateTrainingPartnerRecommendations(
  criteria: RecommendationCriteria
): Promise<TrainingPartnerRecommendation[]> {
  const { currentUser, availablePartners, maxRecommendations = 5 } = criteria;
  
  try {
    // Filter out current user from available partners
    const eligiblePartners = availablePartners.filter(
      partner => partner.id !== currentUser.id
    );

    if (eligiblePartners.length === 0) {
      return [];
    }

    // Create a detailed prompt for AI analysis
    const prompt = `
You are a martial arts training partner recommendation expert. Analyze the current user's profile and recommend the best training partners from the available options.

CURRENT USER PROFILE:
- Name: ${currentUser.firstName} ${currentUser.lastName}
- Role: ${currentUser.profile?.role || 'member'}
- Skill Level: ${currentUser.profile?.skillLevel || 'beginner'}
- Belt Rank: ${currentUser.profile?.beltRank || 'white'}
- Location: ${currentUser.profile?.location || 'Unknown'}
- Training Goals: ${currentUser.profile?.trainingGoals || 'Not specified'}
- Bio: ${currentUser.profile?.bio || 'No bio available'}
- Availability: ${currentUser.profile?.availability || 'Not specified'}

AVAILABLE TRAINING PARTNERS:
${eligiblePartners.map((partner, index) => `
${index + 1}. ${partner.firstName} ${partner.lastName}
   - Role: ${partner.profile?.role || 'member'}
   - Skill Level: ${partner.profile?.skillLevel || 'beginner'}
   - Belt Rank: ${partner.profile?.beltRank || 'white'}
   - Location: ${partner.profile?.location || 'Unknown'}
   - Training Goals: ${partner.profile?.trainingGoals || 'Not specified'}
   - Bio: ${partner.profile?.bio || 'No bio available'}
   - Availability: ${partner.profile?.availability || 'Not specified'}
   - Average Rating: ${partner.averageRating || 'No ratings yet'}
`).join('')}

Please analyze and recommend the top ${maxRecommendations} training partners. For each recommendation, provide:
1. Partner name and index number from the list
2. Compatibility score (1-100)
3. 2-3 specific reasons why they're a good match
4. 2-3 suggested training activities they could do together

Consider factors like:
- Complementary skill levels (beginner with advanced for mentoring, similar levels for peer learning)
- Matching or complementary training goals
- Geographic proximity
- Schedule compatibility
- Personality/bio compatibility
- Role compatibility (instructor-student, peer-peer)

Return your response in JSON format:
{
  "recommendations": [
    {
      "partnerIndex": 1,
      "partnerName": "Name",
      "compatibilityScore": 85,
      "reasons": ["reason 1", "reason 2", "reason 3"],
      "suggestedActivities": ["activity 1", "activity 2", "activity 3"]
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert martial arts training partner matching system. Provide thoughtful, specific recommendations based on compatibility factors."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    
    // Map AI recommendations back to user objects
    const recommendations: TrainingPartnerRecommendation[] = aiResponse.recommendations
      .map((rec: any) => {
        const partnerIndex = rec.partnerIndex - 1; // Convert to 0-based index
        const partner = eligiblePartners[partnerIndex];
        
        if (!partner) {
          console.warn(`Partner at index ${partnerIndex} not found`);
          return null;
        }

        return {
          user: partner,
          compatibilityScore: Math.max(1, Math.min(100, rec.compatibilityScore)),
          reasons: rec.reasons || [],
          suggestedTrainingActivities: rec.suggestedActivities || []
        };
      })
      .filter(Boolean) // Remove null entries
      .slice(0, maxRecommendations); // Ensure we don't exceed max

    return recommendations;

  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    
    // Fallback to basic compatibility scoring if AI fails
    return generateFallbackRecommendations(criteria);
  }
}

// Fallback recommendation system using rule-based matching
function generateFallbackRecommendations(
  criteria: RecommendationCriteria
): TrainingPartnerRecommendation[] {
  const { currentUser, availablePartners, maxRecommendations = 5 } = criteria;
  
  const eligiblePartners = availablePartners.filter(
    partner => partner.id !== currentUser.id
  );

  const scoredPartners = eligiblePartners.map(partner => {
    let score = 0;
    const reasons: string[] = [];
    const activities: string[] = [];

    // Skill level compatibility
    const currentSkill = currentUser.profile?.skillLevel || 'beginner';
    const partnerSkill = partner.profile?.skillLevel || 'beginner';
    
    if (currentSkill === partnerSkill) {
      score += 30;
      reasons.push("Same skill level for peer learning");
      activities.push("Sparring sessions", "Technique practice");
    } else if (
      (currentSkill === 'beginner' && partnerSkill === 'advanced') ||
      (currentSkill === 'advanced' && partnerSkill === 'beginner')
    ) {
      score += 25;
      reasons.push("Complementary skill levels for mentoring");
      activities.push("One-on-one instruction", "Technique breakdown");
    }

    // Role compatibility
    if (partner.profile?.role === 'instructor') {
      score += 20;
      reasons.push("Professional instructor available");
      activities.push("Private lessons", "Form correction");
    }

    // Location proximity (basic check)
    if (currentUser.profile?.location && partner.profile?.location) {
      const currentLocation = currentUser.profile.location.toLowerCase();
      const partnerLocation = partner.profile.location.toLowerCase();
      
      if (currentLocation.includes('orlando') && partnerLocation.includes('orlando')) {
        score += 15;
        reasons.push("Close geographic location");
      }
    }

    // Rating bonus
    if (partner.averageRating && partner.averageRating >= 4) {
      score += 10;
      reasons.push("Highly rated community member");
    }

    // Default activities if none specified
    if (activities.length === 0) {
      activities.push("Basic technique practice", "Conditioning exercises");
    }

    return {
      user: partner,
      compatibilityScore: Math.min(100, score),
      reasons: reasons.slice(0, 3),
      suggestedTrainingActivities: activities.slice(0, 3)
    };
  });

  // Sort by compatibility score and return top recommendations
  return scoredPartners
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, maxRecommendations);
}

export async function generatePersonalizedTrainingPlan(
  user: UserWithProfile,
  partner?: UserWithProfile
): Promise<{
  plan: string[];
  focus: string;
  duration: string;
}> {
  try {
    const prompt = `
Create a personalized training plan for a martial artist with the following profile:

USER PROFILE:
- Skill Level: ${user.profile?.skillLevel || 'beginner'}
- Belt Rank: ${user.profile?.beltRank || 'white'}
- Training Goals: ${user.profile?.trainingGoals || 'general improvement'}
- Bio: ${user.profile?.bio || 'No additional info'}

${partner ? `
TRAINING PARTNER:
- Name: ${partner.firstName}
- Skill Level: ${partner.profile?.skillLevel || 'beginner'}
- Role: ${partner.profile?.role || 'member'}
- Bio: ${partner.profile?.bio || 'No additional info'}
` : ''}

Create a focused training plan with:
1. 5-7 specific training activities
2. Main focus area
3. Recommended session duration

Consider the skill levels and goals. Return in JSON format:
{
  "plan": ["activity 1", "activity 2", ...],
  "focus": "main focus area",
  "duration": "recommended duration"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a martial arts training expert. Create practical, progressive training plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || '{"plan": ["Basic techniques"], "focus": "Fundamentals", "duration": "60 minutes"}');

  } catch (error) {
    console.error("Error generating training plan:", error);
    
    // Fallback training plan
    const skillLevel = user.profile?.skillLevel || 'beginner';
    
    if (skillLevel === 'beginner') {
      return {
        plan: [
          "Warm-up and stretching",
          "Basic stance and posture",
          "Fundamental escapes",
          "Simple guard positions",
          "Cool-down techniques"
        ],
        focus: "Building fundamentals",
        duration: "45-60 minutes"
      };
    } else {
      return {
        plan: [
          "Dynamic warm-up",
          "Advanced technique drilling",
          "Live sparring rounds",
          "Position-specific training",
          "Conditioning exercises"
        ],
        focus: "Advanced skill development",
        duration: "60-90 minutes"
      };
    }
  }
}