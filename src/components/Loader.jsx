function Loader({ text = "Loading..." }) {
  return (
    <div className="global-loader">
      <div className="spinner"></div>
      <p style={{ textAlign: 'center', padding: '20px' }}>{text}</p>
    </div>
  );
}

export default Loader;