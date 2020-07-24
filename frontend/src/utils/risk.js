export const getRiskBackground = riskLevel => {
  if (riskLevel <= 0.5) {
    return '#49C7B0'
  } else if (riskLevel <= 1.5) {
    return '#68BA96'
  } else if (riskLevel <= 2.5) {
    return '#86AD7C'
  } else if (riskLevel <= 3.5) {
    return '#A59F61'
  } else if (riskLevel <= 4.5) {
    return '#C39247'
  } else if (riskLevel <= 5.5) {
    return '#E1852D'
  } else {
    return '#FF7813'
  }
}
