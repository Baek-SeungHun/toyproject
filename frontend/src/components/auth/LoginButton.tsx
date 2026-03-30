import { useAuth } from '@/contexts/AuthContext';

interface LoginButtonProps {
  onLogout?: () => void;
}

function LoginButton({ onLogout }: LoginButtonProps) {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div
        className="h-9 animate-pulse"
        style={{
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-bg-secondary)',
        }}
      />
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-8 h-8 shrink-0"
              style={{ borderRadius: 'var(--radius-pill)' }}
            />
          ) : (
            <div
              className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-white shrink-0"
              style={{
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-primary)',
              }}
            >
              {user.name.charAt(0)}
            </div>
          )}
          <span
            className="text-sm font-medium truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {user.name}
          </span>
        </div>
        <button
          onClick={() => { logout(); onLogout?.(); }}
          className="text-xs font-medium px-2.5 py-1.5 transition-colors shrink-0"
          style={{
            color: 'var(--color-text-tertiary)',
            borderRadius: 'var(--radius-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-tertiary)';
          }}
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors"
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
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Google 로그인
    </button>
  );
}

export default LoginButton;
