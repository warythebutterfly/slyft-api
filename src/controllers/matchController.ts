//import { BipartiteGraph, Hungarian } from "bipartite-matching";

interface ILocation {
  lat: number;
  lng: number;
}
interface IMatch {
  passengerType?: string;
  riderType?: string;
  userType: string;
}
interface Location {
  // Define attributes of a point
  description: string;
  location: ILocation;
}
export interface Driver {
  // Define attributes of a driver
  destination: Location;
  match: IMatch;
  origin: Location;
  user: any;
}

export interface Passenger {
  // Define attributes of a passenger
  destination: Location;
  match: IMatch;
  origin: Location;
  user: any;
}
// // Function to match drivers with passengers
// export async function matchDriversPassengers(
//   drivers: Driver[],
//   passengers: Passenger[],
//   distanceThreshold: number
// ) {
//   try {
//     let matches = []; // Array to store matched pairs

//     // Convert distance threshold from kilometers to meters
//     const distanceThresholdMeters = distanceThreshold * 1000;

//     // Iterate through each driver
//     for (let driver of drivers) {
//       let bestMatch = null; // Variable to store the best passenger match
//       let bestDistance = Number.MAX_VALUE; // Initialize best distance to a very large number

//       // Iterate through each passenger to find the best match for the current driver
//       for (let passenger of passengers) {
//         // Calculate the distance between the origins and destinations of the driver and passenger
//         const originDistance = calculateDistance(
//           driver.origin.location.lat,
//           driver.origin.location.lng,
//           passenger.origin.location.lat,
//           passenger.origin.location.lng
//         );
//         const destinationDistance = calculateDistance(
//           driver.destination.location.lat,
//           driver.destination.location.lng,
//           passenger.destination.location.lat,
//           passenger.destination.location.lng
//         );

//         // Convert distances from kilometers to meters
//         const originDistanceMeters = originDistance * 1000;
//         const destinationDistanceMeters = destinationDistance * 1000;

//         // console.log(
//         //   originDistanceMeters,
//         //   distanceThresholdMeters,
//         //   destinationDistanceMeters
//         // );

//         console.log(destinationDistanceMeters, distanceThresholdMeters);
//         console.log(destinationDistanceMeters < distanceThresholdMeters);
//         // Check if either the origin or destination distance exceeds the threshold
//         if (
//           originDistanceMeters > distanceThresholdMeters ||
//           destinationDistanceMeters > distanceThresholdMeters
//         ) {
//           // Skip this passenger if either the origin or destination is too far from the driver
//           continue;
//         }

//         passenger.match.riderType === "Slyft for Student"
//           ? (passenger.match.riderType = "Student")
//           : passenger.match.riderType === "Slyft for Staff"
//           ? (passenger.match.riderType = "Staff")
//           : (passenger.match.riderType = null);

//         driver.match.passengerType === "Staff or Student" &&
//           (driver.match.passengerType = null);

//         // Check if the current passenger is a better match than the current best match
//         if (passenger.match.riderType && driver.match.passengerType) {
//           console.log(driver.match.passengerType, passenger.user.userType);
//           console.log(passenger.match.riderType, driver.user.userType);
//           if (
//             originDistance < bestDistance &&
//             destinationDistance < bestDistance &&
//             driver.match.passengerType === passenger.user.userType &&
//             passenger.match.riderType === driver.user.userType
//           ) {
//             // Update the best match and best distance
//             bestMatch = passenger;
//             bestDistance = Math.max(originDistance, destinationDistance);
//           }
//         } else if (passenger.match.riderType) {
//           if (
//             originDistance < bestDistance &&
//             destinationDistance < bestDistance &&
//             passenger.match.riderType === driver.user.userType
//           ) {
//             // Update the best match and best distance
//             bestMatch = passenger;
//             bestDistance = Math.max(originDistance, destinationDistance);
//           }
//         } else if (driver.match.passengerType) {
//           if (
//             originDistance < bestDistance &&
//             destinationDistance < bestDistance &&
//             driver.match.passengerType === passenger.user.userType
//           ) {
//             // Update the best match and best distance
//             bestMatch = passenger;
//             bestDistance = Math.max(originDistance, destinationDistance);
//           }
//         } else {
//           if (
//             originDistance < bestDistance &&
//             destinationDistance < bestDistance
//           ) {
//             // Update the best match and best distance
//             bestMatch = passenger;
//             bestDistance = Math.max(originDistance, destinationDistance);
//           }
//         }
//       }

//       // If a best match was found, add the driver-passenger pair to the matches array
//       if (bestMatch) {
//         matches.push({ driver, passenger: bestMatch });
//       }
//     }

//     return matches; // Return the matched pairs
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// Function to match drivers with passengers
export async function matchDriversPassengers(
  drivers: Driver[],
  passengers: Passenger[],
  distanceThreshold: number
) {
  try {
    let matches = []; // Array to store matched pairs

    // Convert distance threshold from kilometers to meters
    const distanceThresholdMeters = distanceThreshold * 1000;

    // Iterate through each driver
    for (let driver of drivers) {
      let bestMatches = []; // Array to store the best passenger matches

      // Iterate through each passenger to find the best matches for the current driver
      for (let passenger of passengers) {
        // Calculate the distance between the origins and destinations of the driver and passenger
        const originDistance = calculateDistance(
          driver.origin.location.lat,
          driver.origin.location.lng,
          passenger.origin.location.lat,
          passenger.origin.location.lng
        );
        const destinationDistance = calculateDistance(
          driver.destination.location.lat,
          driver.destination.location.lng,
          passenger.destination.location.lat,
          passenger.destination.location.lng
        );

        // Convert distances from kilometers to meters
        const originDistanceMeters = originDistance * 1000;
        const destinationDistanceMeters = destinationDistance * 1000;

        // Check if either the origin or destination distance exceeds the threshold
        if (
          originDistanceMeters > distanceThresholdMeters ||
          destinationDistanceMeters > distanceThresholdMeters
        ) {
          // Skip this passenger if either the origin or destination is too far from the driver
          continue;
        }

        // Simplify rider type checks
        passenger.match.riderType =
          passenger.match.riderType === "Slyft for Student"
            ? "Student"
            : passenger.match.riderType === "Slyft for Staff"
            ? "Staff"
            : null;

        driver.match.passengerType === "Staff or Student" &&
          (driver.match.passengerType = null);

        // Determine if the passenger is a valid match for the driver
        const isMatch =
          passenger.match.riderType &&
          driver.match.passengerType &&
          driver.match.passengerType === passenger.user.userType &&
          passenger.match.riderType === driver.user.userType;

        if (
          isMatch ||
          (!passenger.match.riderType &&
            driver.match.passengerType === passenger.user.userType) ||
          (!driver.match.passengerType &&
            passenger.match.riderType === driver.user.userType) ||
          (!passenger.match.riderType && !driver.match.passengerType)
        ) {
          bestMatches.push({
            passenger,
            distance: Math.max(originDistance, destinationDistance),
          });
        }
      }

      // Sort the best matches by distance and pick the top 3
      bestMatches.sort((a, b) => a.distance - b.distance);
      const top3Matches = bestMatches.slice(0, 3);

      // Add the best matches to the results
      matches.push({
        driver,
        passengers: top3Matches.map((match) => match.passenger),
      });
    }

    return matches; // Return the matched pairs
  } catch (error) {
    console.log(error.message);
  }
}

// Function to match driver with passengers
export async function matchDriverPassengers(
  driver: Driver,
  passengers: Passenger[],
  distanceThreshold: number
) {
  try {
    let matches = []; // Array to store matched pairs

    // Convert distance threshold from kilometers to meters
    const distanceThresholdMeters = distanceThreshold * 1000;

    // Iterate through each driver

    let bestMatches = []; // Array to store the best passenger matches

    // Iterate through each passenger to find the best matches for the current driver
    for (let passenger of passengers) {
      // Calculate the distance between the origins and destinations of the driver and passenger
      const originDistance = calculateDistance(
        driver.origin.location.lat,
        driver.origin.location.lng,
        passenger.origin.location.lat,
        passenger.origin.location.lng
      );
      const destinationDistance = calculateDistance(
        driver.destination.location.lat,
        driver.destination.location.lng,
        passenger.destination.location.lat,
        passenger.destination.location.lng
      );

      // Convert distances from kilometers to meters
      const originDistanceMeters = originDistance * 1000;
      const destinationDistanceMeters = destinationDistance * 1000;

      // Check if either the origin or destination distance exceeds the threshold
      if (
        originDistanceMeters > distanceThresholdMeters ||
        destinationDistanceMeters > distanceThresholdMeters
      ) {
        // Skip this passenger if either the origin or destination is too far from the driver
        continue;
      }

      // Simplify rider type checks
      passenger.match.riderType =
        passenger.match.riderType === "Slyft for Student"
          ? "Student"
          : passenger.match.riderType === "Slyft for Staff"
          ? "Staff"
          : null;

      driver.match.passengerType === "Staff or Student" &&
        (driver.match.passengerType = null);

      // Determine if the passenger is a valid match for the driver
      const isMatch =
        passenger.match.riderType &&
        driver.match.passengerType &&
        driver.match.passengerType === passenger.user.userType &&
        passenger.match.riderType === driver.user.userType;

      if (
        isMatch ||
        (!passenger.match.riderType &&
          driver.match.passengerType === passenger.user.userType) ||
        (!driver.match.passengerType &&
          passenger.match.riderType === driver.user.userType) ||
        (!passenger.match.riderType && !driver.match.passengerType)
      ) {
        bestMatches.push({
          passenger,
          distance: Math.max(originDistance, destinationDistance),
        });
      }
    }

    // Sort the best matches by distance and pick the top 3
    bestMatches.sort((a, b) => a.distance - b.distance);
    const top3Matches = bestMatches.slice(0, 3);

    // Add the best matches to the results
    matches.push({
      driver,
      passengers: top3Matches.map((match) => match.passenger),
    });

    return matches; // Return the matched pairs
  } catch (error) {
    console.log(error.message);
  }
}

// function matchDriversPassengers(drivers: Driver[], passengers: Passenger[]) {
//   const graph = new BipartiteGraph<Driver, Passenger>();

//   // Add nodes (drivers and passengers) to the graph
//   drivers.forEach((driver) => graph.addNode(driver, "driver"));
//   passengers.forEach((passenger) => graph.addNode(passenger, "passenger"));

//   // Add edges between drivers and passengers with weights representing match suitability
//   drivers.forEach((driver) => {
//     passengers.forEach((passenger) => {
//       const weight = calculateMatchWeight(driver, passenger);
//       graph.addEdge(driver, passenger, weight);
//     });
//   });

//   // Apply the Hungarian algorithm to find the maximum weighted matching
//   const matching = Hungarian(graph);

//   // Extract the matched pairs from the matching
//   const matches = matching.edges.map((edge) => ({
//     driver: edge.source,
//     passenger: edge.target,
//   }));

//   return matches;
// }

// Function to calculate the weight of a match between a driver and a passenger
function calculateMatchWeight(driver: Driver, passenger: Passenger): number {
  // You can define your own logic to calculate the weight based on various factors
  const originDistance = calculateDistance2(driver.origin, passenger.origin);
  const destinationDistance = calculateDistance2(
    driver.destination,
    passenger.destination
  );

  // Weight is the sum of distances between origin and destination
  return originDistance + destinationDistance;
  // For simplicity, let's assume a constant weight of 1 for all matches
  // return 1;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

function calculateDistance2(location1: Location, location2: Location): number {
  // Euclidean distance formula
  const latDiff = location1.location.lat - location2.location.lat;
  const lngDiff = location1.location.lng - location2.location.lng;
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}
