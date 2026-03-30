import { useState } from 'react';
import type { RestaurantCreateRequest } from '@/api/restaurants';

const CATEGORIES = [
  '한식', '일식', '중식', '양식', '카페', '분식', '치킨/피자', '기타',
] as const;

interface RestaurantFormProps {
  onSubmit: (data: RestaurantCreateRequest) => void;
  onCancel: () => void;
}

function RestaurantForm({ onSubmit, onCancel }: RestaurantFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    onSubmit({
      name: name.trim(),
      category,
      address: address.trim(),
      rating: rating ? parseFloat(rating) : undefined,
      coordinates: [0, 0], // TODO: 지도 클릭으로 좌표 선택
    });
  };

  const inputStyle = {
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-primary)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(49, 130, 246, 0.12)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-border)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3
        className="text-base font-bold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        맛집 등록
      </h3>

      {/* 이름 */}
      <div>
        <label
          htmlFor="restaurant-name"
          className="block text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          이름 <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="restaurant-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="맛집 이름"
          className="w-full px-4 py-3 text-sm outline-none transition-colors"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus
        />
      </div>

      {/* 카테고리 */}
      <div>
        <label
          htmlFor="restaurant-category"
          className="block text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          카테고리
        </label>
        <select
          id="restaurant-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none transition-colors appearance-none"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 주소 */}
      <div>
        <label
          htmlFor="restaurant-address"
          className="block text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          주소 <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="restaurant-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="주소를 입력하세요"
          className="w-full px-4 py-3 text-sm outline-none transition-colors"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* 평점 */}
      <div>
        <label
          htmlFor="restaurant-rating"
          className="block text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          평점
        </label>
        <input
          type="number"
          id="restaurant-rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="0.0 ~ 5.0"
          min="0"
          max="5"
          step="0.1"
          className="w-full px-4 py-3 text-sm outline-none transition-colors"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={!name.trim() || !address.trim()}
          className="flex-1 py-3 text-sm font-semibold text-white transition-colors"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: (name.trim() && address.trim()) ? 'var(--color-primary)' : 'var(--color-border)',
            cursor: (name.trim() && address.trim()) ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (name.trim() && address.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = (name.trim() && address.trim())
              ? 'var(--color-primary)'
              : 'var(--color-border)';
          }}
        >
          등록하기
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

export default RestaurantForm;
