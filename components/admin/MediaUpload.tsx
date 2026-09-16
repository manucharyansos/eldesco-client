'use client';

import { ChangeEvent, useState } from 'react';
import { adminApi } from '@/lib/cms';
import type { MediaAsset } from '@/types/cms';

export function MediaUpload({ value, onChange, label = 'Image' }: { value?: MediaAsset | null; onChange: (media: MediaAsset | null) => void; label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const media = await adminApi.uploadMedia(file);
      onChange(media);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="media-upload">
      <span className="admin-field-label">{label}</span>
      {value?.url ? (
        <div className="media-upload__preview">
          <img src={value.url} alt={value.file_name} />
          <div><strong>{value.file_name}</strong><small>Media #{value.id}</small><div><label className="admin-button admin-button--small">Replace<input type="file" accept="image/*" onChange={upload} hidden /></label><button type="button" className="admin-button admin-button--small admin-button--danger" onClick={() => onChange(null)}>Remove</button></div></div>
        </div>
      ) : (
        <label className="media-upload__drop">
          <input type="file" accept="image/*" onChange={upload} hidden />
          <span>{loading ? 'Uploading…' : '+'}</span>
          <strong>{loading ? 'Please wait' : 'Upload image'}</strong>
          <small>JPG, PNG, WEBP · up to 12 MB</small>
        </label>
      )}
      {error && <small className="admin-field-error">{error}</small>}
    </div>
  );
}
