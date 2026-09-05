import React from 'react';

const ImageUpload = ({ value, onChange }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (e.g., limit to 2MB to avoid localStorage quota issues)
            if (file.size > 2 * 1024 * 1024) {
                alert('File is too large. Please select an image under 2MB.');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result); // Pass base64 back
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {value && (
                <div style={{
                    width: '60px', height: '60px', borderRadius: '8px',
                    overflow: 'hidden', border: '1px solid #e5e7eb', flexShrink: 0,
                    background: '#f9fafb'
                }}>
                    <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
            <div style={{ flex: 1 }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                        width: '100%', padding: '7px',
                        border: '1px solid #e5e7eb', borderRadius: '8px',
                        fontSize: '13px', color: '#374151', cursor: 'pointer',
                        background: '#fff'
                    }}
                />
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>OR</span>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Paste image URL here..."
                        style={{
                            flex: 1, padding: '7px 10px', border: '1px solid #e5e7eb',
                            borderRadius: '6px', fontSize: '12px', outline: 'none'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
