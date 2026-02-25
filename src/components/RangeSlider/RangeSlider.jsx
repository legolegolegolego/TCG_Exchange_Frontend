import styles from "./RangeSlider.module.css";

const RangeSlider = ({ min = 1, max = 95, step = 1, value = [min, max], onChange }) => {
  const [minVal, maxVal] = value.map(v => Number(v));

  const handleMinChange = (e) => {
    const v = Math.min(Number(e.target.value), maxVal - step);
    onChange && onChange([v, maxVal]);
  };

  const handleMaxChange = (e) => {
    const v = Math.max(Number(e.target.value), minVal + step);
    onChange && onChange([minVal, v]);
  };

  const percent = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.values}>{minVal} — {maxVal}</div>
      <div className={styles.slider}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className={`${styles.thumb} ${styles.thumbLeft}`}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className={`${styles.thumb} ${styles.thumbRight}`}
        />

        <div className={styles.track} />
        <div
          className={styles.range}
          style={{ left: `${percent(minVal)}%`, right: `${100 - percent(maxVal)}%` }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
