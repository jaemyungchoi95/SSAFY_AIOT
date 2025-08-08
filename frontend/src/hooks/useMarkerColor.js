const useMarkerColor = (spot) => {
  if (spot.danger) {
    return '#ff7575';
  } else {
    switch (spot.status) {
      case 'DONE':
        return '#5dd082';
      case 'UNCHECKED':
        return '#ffbc5f';
      default:
        return 'lightgray';
    }
  }
};

export default useMarkerColor;
