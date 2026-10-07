import { useState } from 'react';
import './App.css';

function App() {
  // Fixed Picsum image IDs to avoid randomness
  const imageIds = [237, 238, 239, 240];

  // Currently selected image (shown large)
  const [selectedId, setSelectedId] = useState(imageIds[0]);

  const mainSrc = `https://picsum.photos/id/${selectedId}/1000/600`;
  const thumbnails = imageIds;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Photo Gallery</h1>
      </header>

      <main className="App-content">
        <div className="gallery-card">
          <div className="main-image" aria-live="polite">
            <img src={mainSrc} alt={`Picsum ${selectedId}`} />
          </div>

          <div className="thumbnails" role="list" aria-label="Select a photo">
            {thumbnails.map((id) => (
              <button
                key={id}
                className={`thumbnail-button ${id === selectedId ? 'is-selected' : ''}`}
                onClick={() => setSelectedId(id)}
                aria-label={`Show image ${id}`}
                aria-current={id === selectedId ? 'true' : undefined}
              >
                <img
                  className="thumbnail-img"
                  src={`https://picsum.photos/id/${id}/240/160`}
                  alt={`Thumbnail ${id}`}
                />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
