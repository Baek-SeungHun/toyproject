import { useState } from 'react';
import type { PolygonFormData } from '@/types/polygon';

interface PolygonFormProps {
  onSave: (data: PolygonFormData) => void;
  onCancel: () => void;
}

function PolygonForm({ onSave, onCancel }: PolygonFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 안내 배너 */}
      <div
        className="p-4"
        style={{
          backgroundColor: '#EBF4FF',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-primary)',
        }}
      >
        <p className="text-sm font-medium">
          새로운 영역이 그려졌습니다. 아래 정보를 입력해주세요.
        </p>
      </div>

      {/* 영역 이름 */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          영역 이름 <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 강남 맛집 구역"
          className="w-full px-4 py-3 text-sm outline-none transition-colors"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(49, 130, 246, 0.12)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          autoFocus
        />
      </div>

      {/* 영역 설명 */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          영역 설명
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="이 영역에 대한 설명을 입력하세요"
          rows={3}
          className="w-full px-4 py-3 text-sm outline-none resize-none transition-colors"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(49, 130, 246, 0.12)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 py-3 text-sm font-semibold text-white transition-colors"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: name.trim() ? 'var(--color-primary)' : 'var(--color-border)',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (name.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = name.trim()
              ? 'var(--color-primary)'
              : 'var(--color-border)';
          }}
        >
          저장하기
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-semibold transition-colors"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-border)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
        >
          취소
        </button>
      </div>
    </form>
  );
}

export default PolygonForm;
