# Recursos - Curso Completo Azure DevOps con AI

Repositorio indice para organizar los recursos del curso **Azure DevOps de Cero a Experto con AI**.

Este repositorio funciona como punto de entrada: documenta como clonar, revisar y trabajar con los proyectos del curso sin exponer secretos, artefactos generados ni dependencias locales.

## Repositorios Del Curso

Los recursos principales viven en tres repositorios independientes:

| Proyecto | Proposito |
|---|---|
| `quotes-infra-iac` | Infraestructura como codigo para Azure, Terraform, AKS, Storage y pipelines IaC. |
| `quotes-backend` | API backend de Quotes App con .NET, Azure SQL, JWT, Blob Storage, App Configuration y Application Insights. |
| `quotes-frontend` | Frontend React/Vite de Quotes App con servidor Node para configuracion runtime. |

## Diagramas De Arquitectura

Este indice incluye un diagrama de arquitectura de Quotes App para apoyar la explicacion del curso:

| Archivo | Uso |
|---|---|
| [`arquitectura_quotes_app_diagrams_net_4.drawio.png`](arquitectura_quotes_app_diagrams_net_4.drawio.png) | Imagen lista para ver en GitHub, presentaciones o documentacion. |
| [`arquitectura_quotes_app_diagrams_net_4.drawio.html`](arquitectura_quotes_app_diagrams_net_4.drawio.html) | Version editable/exportable del diagrama en formato Draw.io HTML. |

## Clonar Los Repositorios

Desde esta carpeta, ejecuta:

```bash
git clone https://dev.azure.com/<organizacion>/<proyecto>/_git/quotes-infra-iac
git clone https://dev.azure.com/<organizacion>/<proyecto>/_git/quotes-frontend
git clone https://dev.azure.com/<organizacion>/<proyecto>/_git/quotes-backend
```

> Nota: si Azure DevOps solicita credenciales, usa tu cuenta o un token de acceso personal con permisos minimos.

## Preparacion Segura

Antes de compartir, publicar o hacer push:

1. No subas archivos `.env` reales.
2. No subas `node_modules/`, `dist/`, `bin/` ni `obj/`.
3. No subas archivos Terraform locales como `*.tfstate` o `*.tfvars`.
4. Usa `.env.example` solo con placeholders.
5. Guarda secretos en Azure DevOps variable groups, Key Vault o App Service settings.
6. Rota cualquier secreto que haya estado versionado en el historial.

Archivos/directorios que deben permanecer fuera de Git:

```text
.env
.env.*
node_modules/
dist/
bin/
obj/
.terraform/
*.tfstate
*.tfvars
```

## Trabajo Local

### Backend

```bash
cd quotes-backend
copy .env.example .env
dotnet restore
dotnet run
```

Edita `.env` con valores locales o secretos de desarrollo. No confirmes ese archivo en Git.

### Frontend

```bash
cd quotes-frontend
copy .env.example .env
npm install
npm run dev
```

Configura `VITE_BACKEND_URL` para apuntar al backend local o publicado.

### Infraestructura

```bash
cd quotes-infra-iac
terraform init
terraform plan
```

Usa variables seguras fuera del repositorio para credenciales y configuracion sensible.

## Revision De Seguridad Recomendada

Antes de hacer push en cualquiera de los proyectos:

```bash
git status --short
git diff --check
```

Tambien puedes buscar patrones sensibles:

```bash
rg -n --hidden -g '!**/.git/**' -g '!**/node_modules/**' -g '!**/bin/**' -g '!**/obj/**' "SECRET|PASSWORD|TOKEN|CONNECTION_STRING|AccountKey|PRIVATE KEY"
```

Si aparece un valor real, reemplazalo por un placeholder y rota el secreto en Azure.

## Publicar Este Indice En GitHub

```bash
git init
git add README.md .gitignore
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<usuario-o-organizacion>/<repositorio>.git
git push -u origin main
```

## Buenas Practicas Del Curso

- Mantener cada proyecto en su propio repositorio.
- Documentar variables obligatorias en `.env.example`.
- Usar pipelines con variables secretas, no valores hardcodeados.
- Revisar `git status` antes de cada commit.
- No publicar historial que haya contenido secretos sin rotarlos primero.
- Preferir identidades administradas y Key Vault cuando sea posible.
