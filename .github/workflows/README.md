# GitHub Actions Workflows

Bu klasörde Docker image build ve push işlemleri için GitHub Actions workflow dosyaları bulunmaktadır.

## Gerekli GitHub Secrets

Workflow'ların çalışması için aşağıdaki GitHub Secrets'ların ayarlanması gerekmektedir:

### Repository Settings > Secrets and variables > Actions

1. **DOCKER_REGISTRY**: Docker registry URL'i (örn: `registry.example.com` veya `ghcr.io`)
2. **DOCKER_REGISTRY_USERNAME**: Registry kullanıcı adı
3. **DOCKER_REGISTRY_PASSWORD**: Registry şifresi veya token
4. **API_BASE_URL** (opsiyonel): Frontend build sırasında kullanılacak API base URL (varsayılan: `http://localhost:5052`)

## Workflow Dosyaları

### docker-build-push-simple.yml
Basit versiyon - sadece main branch'e push edildiğinde çalışır ve `latest` ile commit SHA tag'leri ile image'ları push eder.

### docker-build-push.yml
Gelişmiş versiyon - branch, PR, semver tag desteği ile daha detaylı tag yönetimi yapar.

## Kullanım

1. GitHub Secrets'ları ayarlayın
2. Workflow dosyalarından birini seçin (basit için `docker-build-push-simple.yml` önerilir)
3. Seçtiğiniz dosyayı aktif tutun, diğerini silebilir veya devre dışı bırakabilirsiniz
4. Main branch'e push yaptığınızda otomatik olarak image'lar build edilip registry'ye push edilecektir

## Image İsimleri

- Backend: `{REGISTRY}/taskflow-backend:latest`
- Frontend: `{REGISTRY}/taskflow-frontend:latest`

## Örnek Registry URL'leri

- GitHub Container Registry: `ghcr.io`
- Docker Hub: `docker.io` (veya boş bırakılabilir)
- Private Registry: `registry.example.com`
