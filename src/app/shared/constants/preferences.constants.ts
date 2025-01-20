export interface PreferenceCategory {
  category: string;
  preferences: string[];
}

export const PREFERENCES_LIST: PreferenceCategory[] = [
  {
    category: 'Sports',
    preferences: [
      'Soccer',
      'Basketball',
      'Tennis',
      'Swimming',
      'Running',
      'Cycling',
      'Golf',
      'Baseball',
      'Martial Arts',
      'Yoga',
      'Snowboarding',
      'Climbing',
      'Fishing',
      'Hiking',
      'Board Games',
      'Dancing'
    ]
  },
  {
    category: 'Arts & Culture',
    preferences: [
      'Music',
      'Arts',
      'Photography',
      'Painting',
      'Film & Movies'
    ]
  },
  {
    category: 'Technology & Education',
    preferences: [
      'Technology',
      'Education',
      'Language Learning',
      'Reading',
      'Writing'
    ]
  },
  {
    category: 'Health & Wellness',
    preferences: [
      'Wellness & Fitness',
      'Fitness & Bodybuilding',
      'Meditation & Mindfulness'
    ]
  },
  {
    category: 'Social & Outdoor Activities',
    preferences: [
      'Outdoors',
      'Social Events',
      'Networking',
      'Gaming',
      'Travel',
      'Volunteering',
      'Shopping',
      'Gardening',
      'Cooking',
      'Baking',
      'Fashion & Style'
    ]
  }
];


export function categorizePreferences(preferences: string[]): PreferenceCategory[] {
  return PREFERENCES_LIST.reduce((result: PreferenceCategory[], category) => {
    const matchedPreferences = category.preferences.filter((pref) =>
      preferences.includes(pref)
    );

    if (matchedPreferences.length > 0) {
      result.push({
        category: category.category,
        preferences: matchedPreferences
      });
    }

    return result;
  }, []);
}
