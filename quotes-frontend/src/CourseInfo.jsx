export default function CourseInfo() {
  return (
    <div className="courseInfo">
      <section className="courseHeader">
        <h1>📚 Acerca del Curso</h1>
        <p className="subtitle">Azure DevOps de Cero a Experto - Una guía completa y práctica</p>
      </section>

      {/* Qué es Feature Flags */}
      <section className="courseSection">
        <h2>🚩 ¿Qué son los Feature Flags?</h2>
        <p>
          Los <strong>Feature Flags</strong> (o banderas de características) son variables que permiten <strong>activar o desactivar funcionalidades</strong> sin necesidad de recompilar o redesplegar el código. Son fundamentales en la administración operacional moderna.
        </p>
        <div className="featureExamples">
          <h3>Ejemplos en esta app:</h3>
          <div className="example">
            <strong>PUBLIC_FEED_ENABLED</strong>
            <p>Cuando está en <code>false</code>, el feed público se oculta completamente, pero el código sigue existiendo. Perfecto para mantenimiento o limitar acceso temporalmente.</p>
          </div>
          <div className="example">
            <strong>PHOTO_UPLOAD_ENABLED</strong>
            <p>Controla si los usuarios pueden subir fotos a sus pensamientos. Si está desactivado, el selector de archivos desaparece del formulario.</p>
          </div>
          <div className="example">
            <strong>MAINTENANCE_MODE_ENABLED</strong>
            <p>Pone toda la aplicación en modo mantenimiento. Es el nivel más alto de control - muestra un mensaje especial en lugar de la app normal.</p>
          </div>
        </div>
      </section>

      {/* Por qué Feature Flags */}
      <section className="courseSection">
        <h2>💡 ¿Por qué son importantes?</h2>
        <ul className="whyList">
          <li>
            <strong>Control sin redespliegue:</strong> Cambias configuraciones en tiempo real sin tener que compilar y desplegar código.
          </li>
          <li>
            <strong>Rollout gradual:</strong> Activas nuevas funciones solo para un porcentaje de usuarios, midiendo impacto antes de un rollout total.
          </li>
          <li>
            <strong>Mantenimiento sin downtime:</strong> Puedes poner la app en modo mantenimiento sin derribar servidores.
          </li>
          <li>
            <strong>Experiencias personalizadas:</strong> Diferentes usuarios ven diferentes features basadas en reglas (beta testers, región, etc).
          </li>
          <li>
            <strong>Rollback instantáneo:</strong> Si algo sale mal, desactivas el feature al momento, sin redeploy.
          </li>
        </ul>
      </section>

      {/* Cómo funcionan en esta app */}
      <section className="courseSection">
        <h2>⚙️ Cómo funcionan en esta aplicación</h2>
        <div className="flowDiagram">
          <p className="flowStep">
            <strong>Paso 1:</strong> Los feature flags se configuran en <code>App Service Settings</code> o <code>Azure App Configuration</code>
          </p>
          <p className="flowStep">
            <strong>Paso 2:</strong> El servidor Node.js (server.mjs) lee los flags al inicio y los inyecta en la app como <code>window.__APP_CONFIG__</code>
          </p>
          <p className="flowStep">
            <strong>Paso 3:</strong> React (App.jsx) consume estos flags desde <code>RUNTIME_FEATURE_FLAGS</code>
          </p>
          <p className="flowStep">
            <strong>Paso 4:</strong> Según el valor del flag, se muestra o oculta lógicamente cada parte de la UI
          </p>
        </div>
        <p className="note">
          <strong>Nota:</strong> Los flags se cargan <strong>una sola vez al inicio</strong>. Cambiarlos requiere refrescar la página para que React los lea de nuevo.
        </p>
      </section>

      {/* Arquitectura completa */}
      <section className="courseSection">
        <h2>🏗️ Arquitectura completa de la aplicación</h2>
        
        <div className="architectureBox">
          <h3>Frontend</h3>
          <p><strong>React + Vite</strong> - Interfaz de usuario moderna y rápida</p>
          <p className="detail">• Components: Login, Feed, Crear Pensamientos, Likes</p>
          <p className="detail">• Consuma feature flags desde window.__APP_CONFIG__</p>
          <p className="detail">• Se despliega en Azure App Service (Linux)</p>
        </div>

        <div className="architectureBox">
          <h3>Servidor Node.js</h3>
          <p><strong>Express.js vía server.mjs</strong> - Lee app settings y feature flags</p>
          <p className="detail">• Sirve archivos estáticos compilados de React</p>
          <p className="detail">• Inyecta window.__APP_CONFIG__ con feature flags</p>
          <p className="detail">• Puede leer desde Azure App Configuration (opcional)</p>
        </div>

        <div className="architectureBox">
          <h3>Backend API</h3>
          <p><strong>ASP.NET Core Minimal API (.NET 10)</strong> - Lógica de negocio</p>
          <p className="detail">• Autenticación con JWT</p>
          <p className="detail">• CRUD de Pensamientos (Quotes), Likes, Usuarios</p>
          <p className="detail">• Sube/gestiona fotos en Azure Blob Storage</p>
          <p className="detail">• Telemetría en Application Insights</p>
        </div>

        <div className="architectureBox">
          <h3>Base de datos</h3>
          <p><strong>Azure SQL Database</strong> - Datos persistentes</p>
          <p className="detail">• Tablas: AppUsers, Quotes, QuoteLikes</p>
          <p className="detail">• Relaciones: Un usuario puede tener muchos pensamientos y likes</p>
        </div>

        <div className="architectureBox">
          <h3>Almacenamiento</h3>
          <p><strong>Azure Blob Storage</strong> - Fotos de pensamientos</p>
          <p className="detail">• Las fotos se suben desde React</p>
          <p className="detail">• Se guardan en blobs y se referencian por URL pública</p>
        </div>
      </section>

      {/* Dos caminos de despliegue */}
      <section className="courseSection">
        <h2>🚀 Dos caminos para desplegar</h2>
        
        <div className="deploymentPath">
          <h3>Parte 1: El camino sencillo (App Service)</h3>
          <p className="pathDesc">
            Perfecto para aprender sin complejidad. Todo en un solo App Service.
          </p>
          <div className="pathSteps">
            <div className="step">
              <span className="stepNum">1</span>
              <div>
                <strong>Código fuente</strong>
                <p>Tienes dos carpetas: quotes-backend y quotes-frontend</p>
              </div>
            </div>
            <div className="step">
              <span className="stepNum">2</span>
              <div>
                <strong>Pipeline CI/CD (Azure DevOps)</strong>
                <p>Se ejecuta automáticamente cada push a <code>main</code></p>
              </div>
            </div>
            <div className="step">
              <span className="stepNum">3</span>
              <div>
                <strong>Build</strong>
                <p>Backend: <code>dotnet publish</code> genera ZIP</p>
                <p>Frontend: <code>npm run build</code> genera archivos estáticos</p>
              </div>
            </div>
            <div className="step">
              <span className="stepNum">4</span>
              <div>
                <strong>Despliegue</strong>
                <p>Todo sube a Azure App Service (Linux)</p>
                <p>El servidor Node.js sirve la app React y maneja requests a /api</p>
              </div>
            </div>
          </div>
          <p className="pathNote">✅ Rápido • ✅ Fácil de entender • ✅ Perfecto para MVP</p>
        </div>

        <div className="deploymentPath">
          <h3>Parte 2: El camino moderno (Containers)</h3>
          <p className="pathDesc">
            Production-ready con escalado automático y mejor aislamiento.
          </p>
          <div className="pathSteps">
            <div className="step">
              <span className="stepNum">1</span>
              <div>
                <strong>Dockerfile</strong>
                <p>Define cómo construir la imagen Docker del backend</p>
              </div>
            </div>
            <div className="step">
              <span className="stepNum">2</span>
              <div>
                <strong>Pipeline (Docker stage)</strong>
                <p>Crea una imagen Docker: <code>docker build</code></p>
              </div>
            </div>
            <div className="step">
              <span className="stepNum">3</span>
              <div>
                <strong>Azure Container Registry (ACR)</strong>
                <p>La imagen se sube a ACR (tu registro privado)</p>
              </div>
            </div>
            <div className="step">
              <span className="stepNum">4</span>
              <div>
                <strong>Azure Container Apps</strong>
                <p>Descarga la imagen de ACR y la ejecuta</p>
                <p>Escala automáticamente según demanda</p>
              </div>
            </div>
          </div>
          <p className="pathNote">✅ Escalable • ✅ Aislado • ✅ Production-ready</p>
        </div>
      </section>

      {/* Feature Flags en detalle */}
      <section className="courseSection">
        <h2>🎯 Feature Flags en detalle</h2>
        
        <div className="flagDetail">
          <h3>PUBLIC_FEED_ENABLED</h3>
          <div className="flagBox">
            <p><strong>¿Qué hace?</strong></p>
            <p>Controla si la sección "Feed público" es visible en la UI</p>
            <p><strong>Cuándo usar:</strong></p>
            <ul>
              <li>Mantenimiento de base de datos</li>
              <li>Limpieza de datos spam</li>
              <li>Rollout gradual a nuevas regiones</li>
            </ul>
            <p><strong>En el código:</strong></p>
            <p className="code">if (publicFeedEnabled) {"{"}  mostrar feed {"}"}  else {"{"}  mostrar mensaje {"}"}  </p>
          </div>
        </div>

        <div className="flagDetail">
          <h3>PHOTO_UPLOAD_ENABLED</h3>
          <div className="flagBox">
            <p><strong>¿Qué hace?</strong></p>
            <p>Habilita/deshabilita la subida de fotos en pensamientos</p>
            <p><strong>Cuándo usar:</strong></p>
            <ul>
              <li>Blob Storage está en mantenimiento</li>
              <li>Quieres testear la app sin fotos</li>
              <li>Rollout de nueva feature de imagen</li>
            </ul>
            <p><strong>En el código:</strong></p>
            <p className="code">if (photoUploadEnabled) mostrar selector de archivo; else mostrar "desactivado"</p>
          </div>
        </div>

        <div className="flagDetail">
          <h3>MAINTENANCE_MODE_ENABLED</h3>
          <div className="flagBox">
            <p><strong>¿Qué hace?</strong></p>
            <p>Cambia toda la app por una pantalla de mantenimiento</p>
            <p><strong>Cuándo usar:</strong></p>
            <ul>
              <li>SQL Database está siendo upgradeda</li>
              <li>Migraciones de datos criticas</li>
              <li>Parches de seguridad urgentes</li>
            </ul>
            <p><strong>En el código:</strong></p>
            <p className="code">if (maintenanceMode) return {"<"}MaintenanceScreen{"/>"}; else return {"<"}NormalApp{"/>"};</p>
          </div>
        </div>
      </section>

      {/* Cómo configurar Feature Flags */}
      <section className="courseSection">
        <h2>⚙️ Cómo configurar Feature Flags</h2>
        
        <div className="configMethod">
          <h3>Opción 1: App Service App Settings (Más simple)</h3>
          <p>Ve a tu App Service en Azure Portal</p>
          <ol>
            <li>Busca <strong>Configuration</strong> en el menú</li>
            <li>Haz clic en <strong>New application setting</strong></li>
            <li>Nombre: <code>featurePublicFeedEnabled</code>, Valor: <code>true/false</code></li>
            <li>Guarda y la app se reinicia automáticamente</li>
          </ol>
          <p className="configNote">✅ Funciona sin código • ✅ Perfecto para empezar</p>
        </div>

        <div className="configMethod">
          <h3>Opción 2: Azure App Configuration (Más avanzado)</h3>
          <p>Centraliza todos los settings en un recurso dedicado</p>
          <ol>
            <li>Crea un recurso <strong>App Configuration</strong> en Azure</li>
            <li>Define keys: <code>featurePublicFeedEnabled</code>, <code>featurePhotoUploadEnabled</code>, etc</li>
            <li>El servidor Node.js lee desde App Configuration en startup</li>
            <li>Frontend recibe los flags via <code>window.__APP_CONFIG__</code></li>
          </ol>
          <p className="configNote">✅ Centralizado • ✅ Versionable • ✅ Para equipos grandes</p>
        </div>

        <div className="configMethod">
          <h3>Opción 3: Variables de entorno (CI/CD)</h3>
          <p>Configura desde el pipeline de Azure DevOps</p>
          <ol>
            <li>En tu pipeline YAML, define variables en <strong>variables group</strong></li>
            <li>El pipeline inyecta las variables como app settings durante deploy</li>
            <li>El servidor Node.js las lee al iniciar</li>
          </ol>
          <p className="configNote">✅ Declarativo • ✅ Auditable • ✅ Version controlado</p>
        </div>
      </section>

      {/* Flujo de una solicitud */}
      <section className="courseSection">
        <h2>🔄 Flujo completo de una solicitud: "Crear un pensamiento"</h2>
        
        <div className="flowDetail">
          <div className="flowBox">
            <strong>1. Usuario escribe en React (Frontend)</strong>
            <p>Digamos que escribe: "Mi primer pensamiento con Azure"</p>
          </div>
          <div className="arrow">↓</div>
          
          <div className="flowBox">
            <strong>2. React valida Feature Flag</strong>
            <p>Revisa: ¿PHOTO_UPLOAD_ENABLED está true? Si no, muestra error.</p>
          </div>
          <div className="arrow">↓</div>

          <div className="flowBox">
            <strong>3. React hace POST a /api/quotes</strong>
            <p>Envía: contenido, foto (si aplica), is_public</p>
            <p>Incluye el JWT token en header Authorization</p>
          </div>
          <div className="arrow">↓</div>

          <div className="flowBox">
            <strong>4. Backend valida JWT</strong>
            <p>ASP.NET Core verifica que el token es válido y no expiró</p>
          </div>
          <div className="arrow">↓</div>

          <div className="flowBox">
            <strong>5. Backend sube foto a Blob Storage</strong>
            <p>Si la foto existe, la sube a Azure Blob Storage</p>
            <p>Obtiene la URL pública de la foto</p>
          </div>
          <div className="arrow">↓</div>

          <div className="flowBox">
            <strong>6. Backend guarda en SQL Database</strong>
            <p>Inserta registro en tabla Quotes con: contenido, user_id, photo_url, created_at</p>
          </div>
          <div className="arrow">↓</div>

          <div className="flowBox">
            <strong>7. Backend responde OK</strong>
            <p>Returns: {`{ quote_id, content, created_at, photo_url }`}</p>
          </div>
          <div className="arrow">↓</div>

          <div className="flowBox">
            <strong>8. React actualiza el feed</strong>
            <p>Llama loadFeed() y loadMine() para refrescar la lista de pensamientos</p>
          </div>
          <div className="arrow">↓</div>

          <div className="flowBox">
            <strong>9. Usuario ve su pensamiento</strong>
            <p>Aparece en "Mis posts" y en "Feed público" (si is_public=true)</p>
          </div>
        </div>
      </section>

      {/* Herramientas y servicios */}
      <section className="courseSection">
        <h2>🛠️ Herramientas y servicios usados</h2>
        
        <div className="toolsGrid">
          <div className="toolBox">
            <strong>React + Vite</strong>
            <p>Framework frontend moderno y rápido</p>
          </div>
          <div className="toolBox">
            <strong>ASP.NET Core</strong>
            <p>Framework backend de Microsoft, .NET 10</p>
          </div>
          <div className="toolBox">
            <strong>Node.js + Express</strong>
            <p>Servidor que sirve React y maneja config</p>
          </div>
          <div className="toolBox">
            <strong>Azure SQL Database</strong>
            <p>Base de datos relacional en la nube</p>
          </div>
          <div className="toolBox">
            <strong>Azure Blob Storage</strong>
            <p>Almacenamiento de objetos para fotos</p>
          </div>
          <div className="toolBox">
            <strong>Azure App Service</strong>
            <p>Hosting para app web (Parte 1)</p>
          </div>
          <div className="toolBox">
            <strong>Azure Container Apps</strong>
            <p>Hosting de containers (Parte 2)</p>
          </div>
          <div className="toolBox">
            <strong>Azure Container Registry</strong>
            <p>Registro privado para imágenes Docker</p>
          </div>
          <div className="toolBox">
            <strong>Azure DevOps</strong>
            <p>Pipelines CI/CD, control de versiones</p>
          </div>
          <div className="toolBox">
            <strong>Application Insights</strong>
            <p>Monitoreo y telemetría de aplicaciones</p>
          </div>
          <div className="toolBox">
            <strong>Azure App Configuration</strong>
            <p>Gestión centralizada de configuraciones</p>
          </div>
          <div className="toolBox">
            <strong>JWT Auth</strong>
            <p>Autenticación stateless segura</p>
          </div>
        </div>
      </section>

      {/* Casos de uso reales */}
      <section className="courseSection">
        <h2>💼 Casos de uso reales</h2>
        
        <div className="useCaseBox">
          <h3>Escenario 1: Nuevo developer joins al equipo</h3>
          <p>
            Necesita entender cómo la aplicación se despliega. Le dices: "Mira server.mjs, ahí lee los feature flags. Luego ve App.jsx para ver cómo React los usa."
          </p>
        </div>

        <div className="useCaseBox">
          <h3>Escenario 2: Bug en la foto uploader</h3>
          <p>
            En lugar de hacer rollback de todo (que afecta a otros users), simplemente pones PHOTO_UPLOAD_ENABLED=false. Los usuarios siguen usando la app, solo sin fotos, mientras arreglas el bug.
          </p>
        </div>

        <div className="useCaseBox">
          <h3>Escenario 3: Migración urgente de SQL Database</h3>
          <p>
            Pones MAINTENANCE_MODE_ENABLED=true. La app muestra una pantalla amigable diciendo "volveremos en 5 min". Haces la migración sin presión. Cuando terminas, pones MAINTENANCE_MODE=false.
          </p>
        </div>

        <div className="useCaseBox">
          <h3>Escenario 4: Testear con 10% de usuarios</h3>
          <p>
            Tu backend puede implementar lógica: si user_id % 10 == 0, mostrar el nuevo feature. De otro modo, mostrar el viejo. Todo controlado por feature flags en la lógica.
          </p>
        </div>
      </section>

      {/* Aprender más */}
      <section className="courseSection">
        <h2>📖 Cómo aprender con esta aplicación</h2>
        
        <div className="learningPath">
          <div className="pathItem">
            <h3>Paso 1: Ejecuta localmente</h3>
            <p>
              Clona el repo. Configura las connection strings para SQL local. 
              Ejecuta backend y frontend en tu máquina. Juega con la app.
            </p>
          </div>

          <div className="pathItem">
            <h3>Paso 2: Entiende el feature flag "Maintenance Mode"</h3>
            <p>
              Mira Program.cs en el backend. Luego ve App.jsx en el frontend.
              Ve cómo si maintenanceModeEnabled=true, la UI entera cambia.
            </p>
          </div>

          <div className="pathItem">
            <h3>Paso 3: Modifica Feature Flags localmente</h3>
            <p>
              Cambia los valores en window.__APP_CONFIG__ en tu navegador (DevTools Console).
              Observa cómo la UI reacciona en tiempo real.
            </p>
          </div>

          <div className="pathItem">
            <h3>Paso 4: Despliega con Parte 1 (App Service)</h3>
            <p>
              Sigue el README. Crea una cuenta Azure. Despliega con el pipeline simple.
              Observa cómo los feature flags funcionan en producción.
            </p>
          </div>

          <div className="pathItem">
            <h3>Paso 5: Moderniza a Parte 2 (Containers)</h3>
            <p>
              Cuando te sientas cómodo, cambia el pipeline a azure-pipelines-backend-container.yml.
              Aprende cómo Docker + ACR + Container Apps escalan mejor.
            </p>
          </div>

          <div className="pathItem">
            <h3>Paso 6: Experimenta</h3>
            <p>
              Agrega nuevas features. Protegelas con feature flags. Aprende a controlar
              el rollout sin miedo a romper producción.
            </p>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="courseSection">
        <h2>❓ Preguntas frecuentes</h2>
        
        <div className="faqItem">
          <h3>¿Por qué el README es tan largo?</h3>
          <p>
            Porque documentación clara = developers más productivos. Cada sección existe por una razón.
            Si algo no está claro, nos lo reportas.
          </p>
        </div>

        <div className="faqItem">
          <h3>¿Necesito saber C# para entender el backend?</h3>
          <p>
            No es obligatorio, pero ayuda. El backend es API simple: recibe JSON, procesa, devuelve JSON.
            Si conoces cualquier backend language, entenderás la lógica.
          </p>
        </div>

        <div className="faqItem">
          <h3>¿Necesito saber Azure para empezar?</h3>
          <p>
            No. Esta app te enseña Azure desde cero. Parte 1 es tan simple que puedes
            aprender creando recursos step by step.
          </p>
        </div>

        <div className="faqItem">
          <h3>¿Puedo usar esto en producción?</h3>
          <p>
            Depende de tu caso de uso. Es una app de ejemplo educativa, pero la arquitectura
            es production-ready. Solo asegúrate de: HTTPS, validación robusta, monitoring.
          </p>
        </div>

        <div className="faqItem">
          <h3>¿Qué pasa si me quedo atascado?</h3>
          <p>
            Lee el README de nuevo (sí, otra vez). Luego googlea el error específico.
            Si nada funciona, crea un issue en el repo con detalles exactos.
          </p>
        </div>
      </section>

      {/* Apoyo al proyecto */}
      <section className="courseSection supportSection">
        <h2>☕ Apoya el proyecto</h2>
        <p>
          Si esta aplicación te ayudó a aprender Azure DevOps, considera apoyar el proyecto.
          Cada apoyo nos motiva a crear más contenido educativo de calidad.
        </p>
        <a 
          href="https://example.com/support"
          target="_blank" 
          rel="noopener noreferrer"
          className="supportLink"
        >
          ☕ Buy Me a Coffee
        </a>
        <p className="supportText">
          Tu apoyo nos ayuda a:
        </p>
        <ul>
          <li>✅ Crear nuevos cursos sobre Azure</li>
          <li>✅ Mantener esta aplicación actualizada</li>
          <li>✅ Escribir documentación más detallada</li>
          <li>✅ Hacer ejemplos más complejos</li>
        </ul>
      </section>

      {/* Conclusión */}
      <section className="courseSection conclusion">
        <h2>🎓 Conclusión</h2>
        <p>
          Esta aplicación te enseña cómo deployar, escalar y controlar una app moderna con Azure.
          No es solo código - es un sistema completo: frontend, backend, base de datos, storage, CI/CD, feature flags.
        </p>
        <p>
          Empieza por Parte 1 (simple), entiende cada pieza, y cuando te sientas listo,
          evoluciona a Parte 2 (containers). Así es como se construyen aplicaciones en el mundo real.
        </p>
        <p className="finalMessage">
          <strong>Happy learning! 🚀</strong>
        </p>
      </section>
    </div>
  );
}
