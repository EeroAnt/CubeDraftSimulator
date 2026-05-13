import { useState } from 'react';
import { Button } from '../';
import styles from './TagControls.module.css';

export const TagControls = ({
  playerTags,
  onConfirm,
  onCancel,
}) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addNewTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addNewTag();
    }
  };

  return (
    <div className={styles.tagControls}>
      <input
        value={tagInput}
        onChange={e => setTagInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="New tag"
        className={styles.tagInput}
      />
      <Button name="Add" className="button" onClick={addNewTag} />

      {playerTags.length > 0 && (
        <div className={styles.existingTags}>
          {playerTags.map(t => (
            <Button
              key={t}
              name={selectedTags.includes(t) ? `✓ ${t}` : t}
              className="button"
              onClick={() => toggleTag(t)}
            />
          ))}
        </div>
      )}

      <div className={styles.tagActions}>
        <Button
          name={`Done (${selectedTags.length})`}
          className="button"
          onClick={() => onConfirm(selectedTags)}
        />
        <Button name="Cancel" className="button" onClick={onCancel} />
      </div>
    </div>
  );
};