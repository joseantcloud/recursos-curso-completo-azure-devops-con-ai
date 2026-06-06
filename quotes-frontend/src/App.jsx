import { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL, RUNTIME_FEATURE_FLAGS, apiDelete, apiForm, apiGet, apiJson, clearToken, getToken, setToken } from './api.js';
import CourseInfo from './CourseInfo.jsx';

export default function App() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('estudiante@example.com');
  const [password, setPassword] = useState('password123');
  const [user, setUser] = useState(null);
  const [features, setFeatures] = useState(RUNTIME_FEATURE_FLAGS);
  const [feed, setFeed] = useState([]);
  const [mine, setMine] = useState([]);
  const [postsTab, setPostsTab] = useState('feed');
  const [content, setContent] = useState('Mi primer pensamiento desplegado con Azure DevOps');
  const [isPublic, setIsPublic] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [globalTab, setGlobalTab] = useState('app');

  const isAuthenticated = useMemo(() => Boolean(user && getToken()), [user]);
  const publicFeedEnabled = features?.public_feed_enabled ?? true;
  const photoUploadEnabled = features?.photo_upload_enabled ?? true;
  const maintenanceModeEnabled = features?.maintenance_mode_enabled ?? false;
  const visibleFeed = feed.slice(0, 9);

  useEffect(() => {
    loadFeed();
    restoreSession();
  }, []);

  useEffect(() => {
    if (!publicFeedEnabled) {
      setFeed([]);
      return;
    }

    loadFeed();
  }, [publicFeedEnabled]);

  useEffect(() => {
    if (postsTab === 'mine' && isAuthenticated) {
      loadMine();
    }
  }, [postsTab, isAuthenticated]);

  async function restoreSession() {
    if (!getToken()) return;

    try {
      const data = await apiGet('/api/me', { auth: true });
      setUser(data);
      await loadMine();
    } catch {
      clearToken();
      setUser(null);
    }
  }

  async function loadFeed() {
    if (!publicFeedEnabled) {
      setFeed([]);
      return;
    }

    try {
      const data = await apiGet(`/api/quotes?scope=feed&t=${Date.now()}`, { auth: Boolean(getToken()) });
      setFeed(data);
    } catch (error) {
      setMessage(`No fue posible cargar el feed: ${error.message}`);
    }
  }

  async function loadMine() {
    if (!getToken()) return;

    try {
      const data = await apiGet('/api/quotes?scope=mine', { auth: true });
      setMine(data);
    } catch (error) {
      setMessage(`No fue posible cargar tus pensamientos: ${error.message}`);
    }
  }

  async function handleAuth(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const path = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const data = await apiJson(path, { email, password });
      setToken(data.access_token);
      setUser(data.user);
      setMessage(mode === 'register' ? 'Usuario registrado correctamente.' : 'Inicio de sesion correcto.');
      await Promise.all([loadFeed(), loadMine()]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    clearToken();
    setUser(null);
    setMine([]);
    setPostsTab('feed');
    setMessage('Sesion cerrada.');
    await loadFeed();
  }

  async function handleCreateQuote(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    if (photo && !photoUploadEnabled) {
      setBusy(false);
      setMessage('La subida de fotos esta desactivada por feature flag.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('is_public', String(isPublic));
      if (photo) formData.append('photo', photo);

      await apiForm('/api/quotes', formData, { auth: true });
      setContent('');
      setPhoto(null);
      event.target.reset();
      setMessage('Pensamiento creado correctamente.');
      await Promise.all([loadFeed(), loadMine()]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleLike(quoteId, likedByMe) {
    if (!isAuthenticated) {
      setMessage('Debes iniciar sesion para dar like.');
      return;
    }

    try {
      if (likedByMe) {
        await apiDelete(`/api/quotes/${quoteId}/like`, { auth: true });
      } else {
        await apiJson(`/api/quotes/${quoteId}/like`, {}, { auth: true });
      }
      await Promise.all([loadFeed(), loadMine()]);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDelete(quoteId) {
    try {
      await apiDelete(`/api/quotes/${quoteId}`, { auth: true });
      setMessage('Pensamiento eliminado.');
      await Promise.all([loadFeed(), loadMine()]);
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (maintenanceModeEnabled) {
    return (
      <main className="page centered">
        <section className="card maintenance">
          <p className="eyebrow">Maintenance Mode</p>
          <h1>La aplicacion esta en mantenimiento</h1>
          <p>Este bloqueo viene desde feature flags. Es perfecto para explicar control operacional desde variables de entorno del frontend.</p>
        </section>
      </main>
    );
  }

  // Si está viendo "Acerca del Curso", mostrar solo eso
  if (globalTab === 'courseInfo') {
    return (
      <main className="page">
        <header className="globalHeader">
          <div className="globalTabs">
            <button 
              className={globalTab === 'app' ? 'active' : ''} 
              onClick={() => setGlobalTab('app')}
            >
              ← Volver a la app
            </button>
            <button 
              className={globalTab === 'courseInfo' ? 'active' : ''} 
              onClick={() => setGlobalTab('courseInfo')}
            >
              📚 Acerca del Curso
            </button>
          </div>
        </header>
        <CourseInfo />
      </main>
    );
  }

  // Vista normal de la app
  return (
    <main className="page">
      <header className="globalHeader">
        <div className="globalTabs">
          <button 
            className={globalTab === 'app' ? 'active' : ''} 
            onClick={() => setGlobalTab('app')}
          >
            🚀 Quotes App
          </button>
          <button 
            className={globalTab === 'courseInfo' ? 'active' : ''} 
            onClick={() => setGlobalTab('courseInfo')}
          >
            📚 Acerca del Curso
          </button>
        </div>
      </header>
      <header className="hero">
        <div>
          <p className="eyebrow">Azure DevOps de Cero a Experto</p>
          <h1>Quotes App</h1>
          <p className="subtitle">React + ASP.NET Core + Azure App Service + Azure SQL + Blob Storage + CI/CD.</p>
        </div>
        <div className="statusBox">
          <span>API</span>
          <strong>{API_BASE_URL}</strong>
        </div>
      </header>

      {message && <div className="notice">{message}</div>}

      <section className="grid two">
        <section className="card">
          <div className="sectionHeader">
            <h2>{isAuthenticated ? 'Sesion activa' : 'Acceso'}</h2>
            {isAuthenticated && <button className="ghost" onClick={handleLogout}>Cerrar sesion</button>}
          </div>

          {isAuthenticated ? (
            <div className="userPanel">
              <p>Conectado como</p>
              <strong>{user.email}</strong>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="form">
              <div className="tabs">
                <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
                <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Registro</button>
              </div>
              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
              </label>
              <label>
                Password
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength="6" />
              </label>
              <button disabled={busy}>{busy ? 'Procesando...' : mode === 'register' ? 'Crear usuario' : 'Entrar'}</button>
            </form>
          )}
        </section>

        <section className="card">
          <h2>Feature flags</h2>
          <div className="flags">
            <Flag label="PUBLIC_FEED" enabled={features?.public_feed_enabled} />
            <Flag label="PHOTO_UPLOAD" enabled={features?.photo_upload_enabled} />
            <Flag label="MaintenanceMode" enabled={features?.maintenance_mode_enabled} />
          </div>
        </section>
      </section>

      {isAuthenticated && (
        <section className="card">
          <h2>Crear pensamiento</h2>
          <form onSubmit={handleCreateQuote} className="form quoteForm">
            <label>
              Contenido
              <textarea value={content} onChange={(event) => setContent(event.target.value)} rows="4" required />
            </label>
            <fieldset className="visibilityGroup">
              <legend>Visibilidad</legend>
              <div className="visibilityOptions">
                <label className={`visibilityOption ${isPublic ? 'active' : ''}`}>
                  <input checked={isPublic} onChange={() => setIsPublic(true)} type="radio" name="quoteVisibility" />
                  <span>
                    <strong>Público</strong>
                    <small>Se ve en el feed público.</small>
                  </span>
                </label>
                <label className={`visibilityOption ${!isPublic ? 'active' : ''}`}>
                  <input checked={!isPublic} onChange={() => setIsPublic(false)} type="radio" name="quoteVisibility" />
                  <span>
                    <strong>Privado</strong>
                    <small>Solo aparece en mis pensamientos.</small>
                  </span>
                </label>
              </div>
            </fieldset>
            {photoUploadEnabled ? (
              <label>
                Foto opcional
                <input onChange={(event) => setPhoto(event.target.files?.[0] || null)} type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
              </label>
            ) : (
              <div className="disabledNotice">
                <strong>Foto desactivada</strong>
                <span>El feature flag PHOTO_UPLOAD está en OFF, por eso no se muestra el selector de archivos.</span>
              </div>
            )}
            <button disabled={busy}>{busy ? 'Guardando...' : 'Publicar'}</button>
          </form>
        </section>
      )}

      <section className="card postsCard">
        <div className="sectionHeader postsHeader">
          <h2>Posts</h2>
          <div className="postsTabs" role="tablist" aria-label="Selector de posts">
            <button
              type="button"
              className={postsTab === 'feed' ? 'active' : ''}
              onClick={() => setPostsTab('feed')}
              role="tab"
              aria-selected={postsTab === 'feed'}
            >
              Feed público
            </button>
            <button
              type="button"
              className={postsTab === 'mine' ? 'active' : ''}
              onClick={() => setPostsTab('mine')}
              disabled={!isAuthenticated}
              role="tab"
              aria-selected={postsTab === 'mine'}
            >
              Mis posts
            </button>
          </div>
        </div>

        {postsTab === 'feed' ? (
          publicFeedEnabled ? (
            <QuoteList quotes={visibleFeed} onLike={handleLike} className="quoteListFeed" />
          ) : (
            <div className="disabledNotice">
              <strong>Feed público desactivado</strong>
              <span>El feature flag PUBLIC_FEED está en OFF, así que este bloque queda oculto lógicamente aunque la API siga funcionando.</span>
            </div>
          )
        ) : isAuthenticated ? (
          <>
            <div className="sectionHeader postsToolbar">
              <p className="empty">Tus posts privados y públicos aparecen aquí.</p>
              <button className="ghost" onClick={loadMine}>Actualizar</button>
            </div>
            <QuoteList quotes={mine} onLike={handleLike} onDelete={handleDelete} ownerView />
          </>
        ) : (
          <p className="empty">Inicia sesion para ver tus pensamientos privados.</p>
        )}
      </section>
    </main>
  );
}

function Flag({ label, enabled }) {
  return (
    <div className={`flag ${enabled ? 'on' : 'off'}`}>
      <span>{label}</span>
      <strong>{enabled ? 'true' : 'false'}</strong>
    </div>
  );
}

function QuoteList({ quotes, onLike, onDelete, ownerView = false, className = '' }) {
  if (!quotes?.length) {
    return <p className="empty">No hay pensamientos para mostrar.</p>;
  }

  return (
    <div className={`quoteList ${className}`.trim()}>
      {quotes.map((quote) => (
        <article className="quote" key={quote.quote_id}>
          {quote.photo_url && (
            <div className="quoteMedia">
              <img src={quote.photo_url} alt="Foto del pensamiento" loading="lazy" />
            </div>
          )}
          <p>{quote.content}</p>
          <div className="meta">
            <span>{quote.owner_email}</span>
            <span>{quote.is_public ? 'Publico' : 'Privado'}</span>
          </div>
          <div className="actions">
            <button className="ghost" onClick={() => onLike(quote.quote_id, quote.liked_by_me)}>
              {quote.liked_by_me ? 'Quitar like' : 'Like'} · {quote.likes_count}
            </button>
            {ownerView && <button className="danger" onClick={() => onDelete(quote.quote_id)}>Eliminar</button>}
          </div>
        </article>
      ))}
    </div>
  );
}
