# Ayarlio - Randevu ve Planlama Yönetim Sistemi

## Proje Hakkında

Ayarlio, işletmelerin randevu ve planlama süreçlerini dijitalleştiren, çok kiracılı (multi-tenant) bir SaaS platformudur. Her işletme kendi subdomain'i üzerinden hizmet verir ve müşterileri bu subdomain üzerinden randevu alabilir.

### Ana Branch'ler

#### main

- Production ortamını temsil eder
- Her zaman deploy edilebilir durumda olmalıdır
- Sadece release ve hotfix branch'lerinden merge alır
- Doğrudan commit yapılmaz
- Her merge sonrası otomatik olarak production'a deploy edilir

#### develop

- Development/staging ortamını temsil eder
- Tüm feature branch'leri buraya merge edilir
- Sprint sonunda main'e merge edilir
- Integration testleri burada yapılır

### Destek Branch'leri

#### feature/[issues-key]-[kısa-açıklama]

- Yeni özellik geliştirmeleri için kullanılır
- develop branch'inden oluşturulur
- develop branch'ine merge edilir
- Naming örneği: `feature/AYR-123-user-authentication`

#### bugfix/[issues-key]-[kısa-açıklama]

- develop'da bulunan hataların düzeltilmesi için kullanılır
- develop branch'inden oluşturulur
- develop branch'ine merge edilir
- Naming örneği: `bugfix/AYR-145-login-error`

#### hotfix/[issues-key]-[kısa-açıklama]

- Production'daki kritik hataların acil düzeltilmesi için kullanılır
- main branch'inden oluşturulur
- Hem main hem develop branch'lerine merge edilir
- Naming örneği: `hotfix/AYR-189-payment-crash`

#### release/v[versiyon]

- Sprint sonunda develop'dan main'e geçiş için kullanılır
- develop branch'inden oluşturulur
- main ve develop'a merge edilir
- Naming örneği: `release/v1.0.0`

### Branch Yaşam Döngüsü

#### Feature Development

```
develop
  └── feature/AYR-123-user-auth
        ├── commit 1
        ├── commit 2
        └── merge to develop (via PR)
```

#### Release Process

```
develop (Sprint sonu)
  └── release/v1.0.0
        ├── version bump
        ├── final tests
        └── merge to main (via PR)
              └── merge back to develop
```

#### Hotfix Process

```
main (Production issue)
  └── hotfix/AYR-189-critical-bug
        ├── fix
        ├── merge to main (via PR)
        └── merge to develop
```

### Commit Message Standardı

Tüm commit mesajları şu formatta olmalıdır:

```
[issues-key]: Commit mesajı

Örnek:
AYR-123: Kullanıcı authentication sistemi eklendi
AYR-145: Login sayfasındaki form validasyon hatası düzeltildi
```

### Pull Request Kuralları

1. Her PR en az bir reviewer tarafından onaylanmalıdır
2. PR açıklamasında yapılan değişiklikler detaylı açıklanmalıdır
3. İlgili issues PR açıklamasında belirtilmelidir
4. Conflict'ler merge öncesi çözülmelidir

## Kurulum

### Gereksinimler

- Node.js 18+
- MongoDB 6.0+
- npm veya yarn

### Yerel Geliştirme

```bash
# Repository'yi klonlayın
git clone https://github.com/thewoorens/ayarlio.git
cd ayarlio

# Bağımlılıkları yükleyin
yarn

# Ortam değişkenlerini ayarlayın
cp .env.example .env

# Development server'ı başlatın
yarn dev
```
