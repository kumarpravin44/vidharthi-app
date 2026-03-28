
function Loader({ text = "Please Wait..." }) {
  return (
    <div className="global-loader">
      <div className="loader-card">
        <div className="modern-spinner"></div>
        <div className="loader-text">{text}</div>
      </div>
    </div>
  );
}

export default Loader;