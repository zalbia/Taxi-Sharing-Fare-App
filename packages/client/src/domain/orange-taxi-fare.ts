/**
 * Details of a taxi ride used for the calculation in orangeTaxiFare.
 */
interface TaxiRide {
  /**
   * Whether a taxi ride is book
   */
  isBooked: boolean;
  isDayPeriod: boolean;
  meters: number;
  minutes: number;
}

/**
 * Calculates the fare for a Bahrain Orange Taxi Group taxi ride
 *
 * @param ride The details of the taxi ride
 *
 * @return The fare in Bahraini fils.
 */
export default function orangeTaxiFare(ride: TaxiRide): number {
  return ride.meters >= 500 ? 1500 : 1000;
}
