import { CurrentWeatherData, DailyForecastItem, PlanningRecommendation, UnitSystem } from '../types/weather';

export function generatePlanningRecommendations(
  current: CurrentWeatherData,
  todayDaily?: DailyForecastItem,
  unitSystem: UnitSystem = 'metric'
): PlanningRecommendation[] {
  const list: PlanningRecommendation[] = [];

  // Convert current temperature to Celsius for standardized rule logic
  const tempC = unitSystem === 'imperial' ? ((current.temperature - 32) * 5) / 9 : current.temperature;
  const precipProbMax = todayDaily?.precipitationProbabilityMax ?? (current.precipitation > 0 ? 80 : 0);
  const precipSum = todayDaily?.precipitationSum ?? current.precipitation;
  const maxUV = todayDaily?.uvIndexMax ?? current.uvIndex ?? 0;
  const windKmH = unitSystem === 'imperial' ? current.windSpeed * 1.60934 : current.windSpeed;

  // 1. Rain / Umbrella Recommendation (Explicit requirement)
  const isRainyCode = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(current.weatherCode);
  if (isRainyCode || precipProbMax >= 40 || precipSum > 0.5) {
    list.push({
      id: 'carry-umbrella',
      title: 'Carry Umbrella',
      description: `Precipitation risk is ${precipProbMax}%. Expect wet conditions or rain showers today.`,
      category: 'essential',
      badgeText: 'Precipitation Warning',
      iconName: 'Umbrella',
      variant: 'primary',
      actionableTip: 'Keep a waterproof jacket or umbrella in your bag before stepping out.',
    });
  }

  // 2. Outdoor Activities Recommendation (Explicit requirement)
  const isPleasantTemp = tempC >= 15 && tempC <= 26;
  const isLowRainRisk = precipProbMax < 25 && !isRainyCode;
  const isModerateWind = windKmH < 25;
  if (isPleasantTemp && isLowRainRisk && isModerateWind) {
    list.push({
      id: 'good-for-outdoor',
      title: 'Good for Outdoor Activities',
      description: `Comfortable temperature of ${Math.round(current.temperature)}° with low rain chance. Ideal for parks, walks, or sports.`,
      category: 'activity',
      badgeText: 'Optimal Conditions',
      iconName: 'Sun',
      variant: 'success',
      actionableTip: 'Great time for outdoor workouts, picnics, or walking around town.',
    });
  }

  // 3. Hot Weather Recommendation (Explicit requirement)
  if (tempC >= 29) {
    list.push({
      id: 'hot-weather',
      title: 'Hot Weather',
      description: `High temperature reaching ${Math.round(current.temperature)}°. Take precautions against heat stress.`,
      category: 'health',
      badgeText: 'Extreme Temperature',
      iconName: 'Flame',
      variant: 'danger',
      actionableTip: 'Stay hydrated, seek shade during peak hours, and wear lightweight breathable cotton or linen.',
    });
  }

  // 4. Cold Weather Recommendation
  if (tempC <= 10) {
    list.push({
      id: 'cold-weather',
      title: 'Cold Weather Alert',
      description: `Temperatures dipping down to ${Math.round(current.temperature)}°. Chilly conditions ahead.`,
      category: 'clothing',
      badgeText: 'Low Temperature',
      iconName: 'Snowflake',
      variant: 'info',
      actionableTip: 'Wear insulating thermal layers, a cozy heavy coat, scarf, and warm gloves.',
    });
  }

  // 5. High UV Index Recommendation
  if (maxUV >= 6) {
    list.push({
      id: 'high-uv',
      title: 'High UV Index Notice',
      description: `Max UV Index today reaches ${maxUV}. Sun exposure risk is elevated.`,
      category: 'health',
      badgeText: 'UV Shield Recommended',
      iconName: 'SunMedium',
      variant: 'warning',
      actionableTip: 'Apply broad-spectrum SPF 30+ sunscreen, wear UV sunglasses and a brimmed hat.',
    });
  }

  // 6. Windy Weather Recommendation
  if (windKmH >= 28) {
    list.push({
      id: 'windy-alert',
      title: 'Windy Conditions',
      description: `Wind gusts up to ${Math.round(current.windSpeed)} ${unitSystem === 'imperial' ? 'mph' : 'km/h'}.`,
      category: 'essential',
      badgeText: 'Breezy Weather',
      iconName: 'Wind',
      variant: 'warning',
      actionableTip: 'Secure lightweight patio outdoor belongings and carry a windbreaker coat.',
    });
  }

  // 7. Stargazing Opportunity (Night time clear sky)
  if (!current.isDay && current.cloudCover < 20 && [0, 1].includes(current.weatherCode)) {
    list.push({
      id: 'stargazing',
      title: 'Clear Stargazing Sky',
      description: 'Night conditions are clear with minimal cloud coverage.',
      category: 'night',
      badgeText: 'Nighttime Bonus',
      iconName: 'Sparkles',
      variant: 'info',
      actionableTip: 'Ideal night for viewing constellations or photography outside.',
    });
  }

  // 8. Cycling / Jogging Fitness Conditions
  if (tempC >= 12 && tempC <= 23 && precipProbMax < 20 && windKmH < 20) {
    list.push({
      id: 'running-cycling',
      title: 'Prime Fitness Weather',
      description: 'Temperatures and calm winds are optimal for cardio exercises.',
      category: 'activity',
      badgeText: 'Fitness Approved',
      iconName: 'Activity',
      variant: 'success',
      actionableTip: 'Great window for running, cycling, or tennis sessions.',
    });
  }

  // Fallback if list is too brief: ensure at least 2 recommendations are present
  if (list.length < 2) {
    if (current.relativeHumidity >= 75) {
      list.push({
        id: 'high-humidity',
        title: 'High Humidity Level',
        description: `Humidity is currently at ${current.relativeHumidity}%.`,
        category: 'health',
        badgeText: 'Moisture Level',
        iconName: 'Droplets',
        variant: 'info',
        actionableTip: 'May feel warmer or sticky outdoors. Stay hydrated throughout the day.',
      });
    } else {
      list.push({
        id: 'moderate-weather',
        title: 'Mild Weather Today',
        description: 'Weather conditions are stable and within standard comfort ranges.',
        category: 'essential',
        badgeText: 'Standard Outlook',
        iconName: 'Compass',
        variant: 'info',
        actionableTip: 'No extreme weather expected. Standard daily routine planning works great.',
      });
    }
  }

  return list;
}
