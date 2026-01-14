# GitHub Actions Workflows

Bu klasörde Docker image build ve push işlemleri için GitHub Actions workflow dosyaları bulunmaktadır.

## Workflow Akışı

Workflow şu sırayla çalışır:

1. **Backend Build ve Test**: .NET projesi restore, build ve test edilir
2. **Frontend Build ve Test**: React projesi dependencies yüklenir, lint çalıştırılır ve build edilir
3. **Docker Build ve Push**: Yukarıdaki adımlar başarılı olursa Docker image'ları build edilip registry'ye push edilir

## Gerekli GitHub Secrets

Workflow'ların çalışması için aşağıdaki GitHub Secrets'ların ayarlanması gerekmektedir:

### Repository Settings > Secrets and variables > Actions

1. **DOCKER_REGISTRY**: Docker registry URL'i (örn: `registry.example.com` veya `ghcr.io`)
2. **DOCKER_REGISTRY_USERNAME**: Registry kullanıcı adı
3. **DOCKER_REGISTRY_PASSWORD**: Registry şifresi veya token
4. **API_BASE_URL** (opsiyonel): Frontend build sırasında kullanılacak API base URL (varsayılan: `http://localhost:5052`)

## Workflow Dosyaları

### docker-build-push-simple.yml
Ana workflow dosyası - build, test ve Docker image push işlemlerini içerir.

**Job'lar:**
- `build-test-backend`: .NET projesini build eder ve testleri çalıştırır
- `build-test-frontend`: React projesini lint eder ve build eder
- `build-and-push`: Her iki job başarılı olursa Docker image'ları build edip push eder

## Kullanım

1. GitHub Secrets'ları ayarlayın
2. Main branch'e push yaptığınızda otomatik olarak:
   - Backend build ve test edilir
   - Frontend lint ve build edilir
   - Her ikisi de başarılı olursa Docker image'ları registry'ye push edilir

## Test ve Build Detayları

### Backend
- .NET 9.0 SDK kullanılır
- `dotnet restore` ile dependencies yüklenir
- `dotnet build` ile proje build edilir
- `dotnet test` ile tüm testler çalıştırılır

### Frontend
- Node.js 20 kullanılır
- Yarn ile dependencies yüklenir (cache kullanılır)
- `yarn lint` ile kod kalitesi kontrol edilir
- `yarn build` ile production build oluşturulur

## Image İsimleri

- Backend: `{REGISTRY}/taskflow-backend:latest` ve `{REGISTRY}/taskflow-backend:{COMMIT_SHA}`
- Frontend: `{REGISTRY}/taskflow-frontend:latest` ve `{REGISTRY}/taskflow-frontend:{COMMIT_SHA}`

## Örnek Registry URL'leri

- GitHub Container Registry: `ghcr.io`
- Docker Hub: `docker.io` (veya boş bırakılabilir)
- Private Registry: `registry.example.com`
