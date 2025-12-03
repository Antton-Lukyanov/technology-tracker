import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {
  return (
    <div className={`technology-card ${status}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="status-indicator">
        <span className={`status-dot ${status}`}></span>
        <span className="status-text">{status}</span>
      </div>
    </div>
  );
}

export default TechnologyCard;