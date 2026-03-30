import React from 'react';

export function SeoFieldInfo({ field }: { field: 'title' | 'metaImage' }) {
  if (field === 'title' || field === 'metaImage') {
    return (
      <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 4 }}>
        není součástí dema
      </div>
    );
  }
  return null;
}
