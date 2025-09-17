type Props = { progress: number; color: string };
const Track = ({ progress, color }: Props) => (
  <div className="track">
    <div className="start">START</div>
    <div className="finish">FINISH</div>
    <div className="car" style={{ transform: `translateX(${progress * 92}%)`, color }}>
      {/* icon via CSS */}
      <div className="car__body" />
    </div>
  </div>
);
export default Track;
