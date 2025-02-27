export interface ActivityCategory {
  category: string;
  names: string[];
}

export const ACTIVITY_TYPE: ActivityCategory[] = [
  {
    category: 'Sports',
    names: [
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
    names: [
      'Music',
      'Arts',
      'Photography',
      'Painting',
      'Film & Movies'
    ]
  },
  {
    category: 'Technology & Education',
    names: [
      'Technology',
      'Education',
      'Language Learning',
      'Reading',
      'Writing'
    ]
  },
  {
    category: 'Health & Wellness',
    names: [
      'Wellness & Fitness',
      'Fitness & Bodybuilding',
      'Meditation & Mindfulness'
    ]
  },
  {
    category: 'Social & Outdoor Activities',
    names: [
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


export function categorizePreferences(preferences: string[]): ActivityCategory[] {
  return ACTIVITY_TYPE.reduce((result: ActivityCategory[], category) => {
    const matchedPreferences = category.names.filter((pref) =>
      preferences.includes(pref)
    );

    if (matchedPreferences.length > 0) {
      result.push({
        category: category.category,
        names: matchedPreferences
      });
    }

    return result;
  }, []);
}
