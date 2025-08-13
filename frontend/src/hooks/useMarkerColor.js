import imgCaution from '../assets/MapCaution.png';
import imgDanger from '../assets/MapDanger.png';
import imgDone from '../assets/MapDone.png';
import imgNothing from '../assets/MapNothing.png';

const useMarkerColor = (spot) => {
  if (spot.status === 'DONE') {
    return imgDone;
  }
  if (spot.danger) {
    return imgDanger;
  }
  switch (spot.status) {
    case 'UNCHECKED':
      return imgCaution;
    default:
      return imgNothing;
  }
};

export default useMarkerColor;
