class KNNMatcher {
  private k: number;
  private points: [number, number][];

  constructor(k: number) {
    this.k = k;
    this.points = [];
  }

  fit(data: [number, number][]) {
    this.points = data;
  }

  match(queryPoint: [number, number], barrierRadius: number): number[] {
    // Filter points within the barrier radius
    const pointsWithinRadius = this.points.filter(
      (point) => this.distance(queryPoint, point) <= barrierRadius
    );

    // Calculate distances to all points within the radius
    const distances = pointsWithinRadius.map((point) =>
      this.distance(queryPoint, point)
    );

    // Sort distances and get indices of k nearest points within the radius
    const indices = distances
      .map((_, index) => index)
      .sort((a, b) => distances[a] - distances[b])
      .slice(0, this.k);

    return indices;
  }

  public distance(point1: [number, number], point2: [number, number]): number {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

// Example usage:
const unilag: [number, number] = [6.5179, 3.3903]; // University of Lagos (UNILAG), Akoka

// Coordinates of nearby locations
const yaba: [number, number] = [6.5086, 3.3797]; // Yaba, Lagos
const surulere: [number, number] = [6.4874, 3.3539]; // Surulere, Lagos
const victoriaIsland: [number, number] = [6.4281, 3.4215]; // Victoria Island, Lagos
const ikeja: [number, number] = [6.6059, 3.349]; // Ikeja, Lagos
const lekki: [number, number] = [6.4281, 3.6024]; // Lekki, Lagos

// Instantiate and fit KNNMatcher
const knnMatcher = new KNNMatcher(3);

// Barrier radius around UNILAG in kilometers
const barrierRadius = 5; // Change this radius according to your requirement

// Filter nearby locations based on barrier radius
const nearbyLocations = [yaba, surulere, victoriaIsland, ikeja, lekki].filter(
  (point) => knnMatcher.distance(unilag, point) <= barrierRadius
);

// Fit the KNNMatcher with the filtered nearby locations
knnMatcher.fit(nearbyLocations);

// Match UNILAG's coordinates within the barrier radius
const matchedIndicesUnilag = knnMatcher.match(unilag, barrierRadius);
console.log(
  "Nearest locations to UNILAG within barrier radius:",
  matchedIndicesUnilag
);
