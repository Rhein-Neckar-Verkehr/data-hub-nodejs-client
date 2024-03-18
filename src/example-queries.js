/**
 *   Set of example queries for usage with GraphQL API functions.
 *   Mostly from https://github.com/Rhein-Neckar-Verkehr/Data-Hub-API-How-To
 */

const load = `query {
                station(id: "2417") {
                  hafasID
                  longName
                  journeys(startTime: "2024-02-26T17:00:00Z", first: 3) {
                    totalCount
                    elements {
                      ... on Journey {
                        id
                        line {
                          id
                        }
                        loadsForecastType

                        loads(onlyHafasID: "2417") {
                          realtime
                          forecast
                          adjusted
                          loadType
                          ratio
                        }

                        stops(only: "2417") {
                          plannedDeparture {
                            isoString
                          }

                          realtimeDeparture {
                            isoString
                          }
                        }
                      }
                    }
                  }
                }
              }`


const monitor = `query {
                    station(id: "2417") {
                      hafasID
                      longName
                      journeys(startTime: "2024-02-26T17:00:00Z", first: 2) {
                        totalCount
                        elements {
                          ... on Journey {
                            line {
                              id
                            }

                            stops(onlyHafasID: "2417") {
                              plannedDeparture {
                                isoString
                              }

                              realtimeDeparture {
                                isoString
                              }
                            }
                          }
                        }
                      }
                    }
                  }`


const station = `query {
                    station(id: "2471") {
                      hafasID
                      longName
                      shortName
                      name
                    }
                  }`


const stations = `query {
                    stations(first: 3, lat: 49.483076, long: 8.468409, distance: 0.5) {
                      totalCount
                      elements {
                        ... on Station {
                          hafasID
                          globalID
                          longName
                        }
                      }
                    }
                  }`;

const trip = `query {
                trips(
                  originGlobalID: "de:08222:2471"
                  destinationGlobalID: "de:08222:2417"
                  departureTime: "2024-02-26T17:00:00Z"
                ) {
                  startTime {
                    isoString
                  }

                  endTime {
                    isoString
                  }

                  interchanges

                  legs {
                    ... on InterchangeLeg {
                      mode
                    }

                    ... on TimedLeg {
                      board {
                        point {
                          ... on StopPoint {
                            ref
                            stopPointName
                          }
                        }
                        estimatedTime {
                          isoString
                        }
                        timetabledTime {
                          isoString
                        }
                      }

                      alight {
                        point {
                          ... on StopPoint {
                            ref
                            stopPointName
                          }
                        }

                        estimatedTime {
                          isoString
                        }
                        timetabledTime {
                          isoString
                        }
                      }

                      service {
                        type
                        name
                        description
                        destinationLabel
                      }
                    }

                    ... on ContinuousLeg {
                      mode
                    }
                  }
                }
              }`;


module.exports = {
    load: load,
    monitor: monitor,
    station: station,
    stations: stations,
    trip: trip
};