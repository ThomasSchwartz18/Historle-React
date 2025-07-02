import React from 'react';

export default function GameOverModal({
  visible,
  resultHeader,
  correctAnswer,
  summary,
  allClues = [],
  showNameEntry = false,
  playerName,
  onPlayerNameChange,
  xUsername,
  onXUsernameChange,
  onSubmitScore,
  onClose
}) {
  return (
    <div id="game-over" className={`modal ${visible ? '' : 'hidden'}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button
          className="modal-close"
          id="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          x
        </button>
        <div className="result-container">
          <h2 id="result-header">{resultHeader}</h2>
          <p id="correct-answer">{correctAnswer}</p>
          <div className="summary" id="event-summary">
            {summary}
          </div>

          <h2>Help Historle grow by sharing your results!</h2>
          <div className="share-container">
            <button id="share-facebook" className="share-btn facebook">
              <i className="fab fa-facebook-f"></i> Facebook
            </button>
            <button id="share-twitter" className="share-btn twitter">
              <i className="fab fa-twitter"></i> Twitter
            </button>
            <button id="share-instagram" className="share-btn instagram">
              <i className="fab fa-instagram"></i> Instagram
            </button>
            <button id="share-message" className="share-btn message">
              <i className="fas fa-comment-alt"></i> Message
            </button>
          </div>

          <a href="/articles" className="game-over-modal-article" title="Articles">
            Read more Articles!
          </a>

          <div id="all-clues-container" className="all-clues-container">
            {allClues.map((clue, idx) => (
              <p key={idx} className="clue">
                {clue}
              </p>
            ))}
          </div>

          {showNameEntry && (
            <div className="name-entry" id="name-entry">
              <p>Congratulations! Enter your name for the leaderboard:</p>
              <div className="input-group">
                <input
                  type="text"
                  id="player-name"
                  placeholder="Your name"
                  maxLength="20"
                  aria-label="Enter your name"
                  value={playerName}
                  onChange={onPlayerNameChange}
                />
              </div>
              <p>Optional: Enter your X username:</p>
              <div className="input-group">
                <input
                  type="text"
                  id="x-username"
                  placeholder="Your X username (optional)"
                  maxLength="30"
                  aria-label="Enter your X username"
                  value={xUsername}
                  onChange={onXUsernameChange}
                />
              </div>
              <button
                id="submit-score"
                aria-label="Submit score"
                onClick={onSubmitScore}
              >
                Submit Score
              </button>
            </div>
          )}

          <p className="return-tomorrow">
            Come back tomorrow for a new historical moment!
          </p>
        </div>
      </div>
    </div>
  );
}