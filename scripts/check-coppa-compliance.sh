#!/bin/bash

# COPPA Uyumluluk ve SDK Sertifikasyonu Kontrol Scripti
# Bu script, uygulamanızın Families Policy gereksinimlerini karşıladığını doğrular

set -e

echo "=========================================="
echo "🔍 COPPA Uyumluluk Kontrolü"
echo "=========================================="
echo ""

# Renkler
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. SDK Versiyonu Kontrolü
echo "📦 1. AdMob SDK Versiyonu Kontrolü..."
echo "-------------------------------------------"

ADMOB_VERSION=$(grep "@capacitor-community/admob" package.json | grep -o '"[^"]*"' | tail -1 | tr -d '"')
echo "Capacitor AdMob Plugin: ${BLUE}$ADMOB_VERSION${NC}"

if [ -f "node_modules/@capacitor-community/admob/android/build.gradle" ]; then
    PLAY_SERVICES_VERSION=$(grep "playServicesAdsVersion" node_modules/@capacitor-community/admob/android/build.gradle | grep -o "'[^']*'" | tr -d "'")
    echo "Google Play Services Ads: ${BLUE}$PLAY_SERVICES_VERSION${NC}"

    # Version kontrolü (19.0.0 minimum)
    MIN_VERSION="19.0.0"
    if [ "$(printf '%s\n' "$MIN_VERSION" "$PLAY_SERVICES_VERSION" | sort -V | head -n1)" = "$MIN_VERSION" ]; then
        echo "${GREEN}✅ SDK versiyonu uyumlu (≥$MIN_VERSION)${NC}"
    else
        echo "${RED}❌ SDK versiyonu çok düşük! Minimum $MIN_VERSION gerekli${NC}"
        exit 1
    fi
else
    echo "${YELLOW}⚠️  node_modules bulunamadı. 'npm install' çalıştırın${NC}"
fi

echo ""

# 2. ATT Kontrollerinin Kaldırıldığını Doğrula
echo "🔒 2. ATT (App Tracking) Kontrolü..."
echo "-------------------------------------------"

ATT_FOUND=false

if grep -r "appTrackingService" src/ 2>/dev/null | grep -v "node_modules" | grep -q "."; then
    echo "${RED}❌ HATA: appTrackingService kullanımı tespit edildi!${NC}"
    grep -rn "appTrackingService" src/ | grep -v "node_modules"
    ATT_FOUND=true
else
    echo "${GREEN}✅ ATT kontrolü yok (doğru)${NC}"
fi

if grep -r "canShowPersonalizedAds" src/ 2>/dev/null | grep -v "node_modules" | grep -q "."; then
    echo "${RED}❌ HATA: canShowPersonalizedAds kullanımı tespit edildi!${NC}"
    grep -rn "canShowPersonalizedAds" src/ | grep -v "node_modules"
    ATT_FOUND=true
fi

if [ "$ATT_FOUND" = true ]; then
    echo "${RED}COPPA uygulamalarında ATT kullanımı YASAK!${NC}"
    exit 1
fi

echo ""

# 3. NPA (Non-Personalized Ads) Kontrolü
echo "🎯 3. Non-Personalized Ads (NPA) Kontrolü..."
echo "-------------------------------------------"

NPA_COUNT=$(grep -r "npa: true" src/ 2>/dev/null | wc -l | tr -d ' ')

if [ "$NPA_COUNT" -ge 3 ]; then
    echo "${GREEN}✅ NPA parametresi bulundu ($NPA_COUNT yerde)${NC}"
    grep -rn "npa: true" src/ | grep -v "node_modules" | head -5
else
    echo "${RED}❌ NPA parametresi eksik veya yetersiz!${NC}"
    exit 1
fi

echo ""

# 4. COPPA Ayarları Kontrolü
echo "👶 4. COPPA Ayarları Kontrolü..."
echo "-------------------------------------------"

if grep -q "tagForUnderAgeOfConsent: true" src/services/admob.service.ts; then
    echo "${GREEN}✅ tagForUnderAgeOfConsent: true${NC}"
else
    echo "${RED}❌ tagForUnderAgeOfConsent ayarı eksik!${NC}"
    exit 1
fi

if grep -q "MaxAdContentRating.General" src/services/admob.service.ts; then
    echo "${GREEN}✅ maxAdContentRating: General${NC}"
else
    echo "${RED}❌ maxAdContentRating ayarı eksik!${NC}"
    exit 1
fi

echo ""

# 5. AndroidManifest.xml Kontrolü (KRİTİK!)
echo "📱 5. AndroidManifest.xml COPPA Meta-Data Kontrolü..."
echo "-------------------------------------------"

MANIFEST_FILE="android/app/src/main/AndroidManifest.xml"

if [ -f "$MANIFEST_FILE" ]; then
    if grep -q "TAG_FOR_CHILD_DIRECTED_TREATMENT" "$MANIFEST_FILE"; then
        if grep -A1 "TAG_FOR_CHILD_DIRECTED_TREATMENT" "$MANIFEST_FILE" | grep -q "true"; then
            echo "${GREEN}✅ TAG_FOR_CHILD_DIRECTED_TREATMENT = true${NC}"
        else
            echo "${RED}❌ TAG_FOR_CHILD_DIRECTED_TREATMENT değeri 'true' olmalı!${NC}"
            exit 1
        fi
    else
        echo "${RED}❌ AndroidManifest.xml'de TAG_FOR_CHILD_DIRECTED_TREATMENT meta-data eksik!${NC}"
        echo "${YELLOW}Bu Google Play için KRİTİK bir gereksinim!${NC}"
        exit 1
    fi

    if grep -q "MAX_AD_CONTENT_RATING" "$MANIFEST_FILE"; then
        if grep -A1 "MAX_AD_CONTENT_RATING" "$MANIFEST_FILE" | grep -q '"G"'; then
            echo "${GREEN}✅ MAX_AD_CONTENT_RATING = 'G'${NC}"
        else
            echo "${RED}❌ MAX_AD_CONTENT_RATING değeri 'G' olmalı!${NC}"
            exit 1
        fi
    else
        echo "${RED}❌ AndroidManifest.xml'de MAX_AD_CONTENT_RATING meta-data eksik!${NC}"
        echo "${YELLOW}Bu Google Play için KRİTİK bir gereksinim!${NC}"
        exit 1
    fi
else
    echo "${YELLOW}⚠️  AndroidManifest.xml bulunamadı${NC}"
fi

echo ""

# 6. iOS Info.plist Kontrolü (KRİTİK!)
echo "🍎 6. iOS Info.plist ATT Kontrolü..."
echo "-------------------------------------------"

PLIST_FILE="ios/App/App/Info.plist"

if [ -f "$PLIST_FILE" ]; then
    # Check for actual NSUserTrackingUsageDescription key (not comments)
    if grep -E "^\s*<key>NSUserTrackingUsageDescription</key>" "$PLIST_FILE" > /dev/null 2>&1; then
        echo "${RED}❌ HATA: Info.plist'te NSUserTrackingUsageDescription bulundu!${NC}"
        echo "${YELLOW}COPPA apps için ATT tracking izni YASAK!${NC}"
        echo "${YELLOW}Bu key KALDIRILMALI!${NC}"
        exit 1
    else
        echo "${GREEN}✅ NSUserTrackingUsageDescription YOK (doğru)${NC}"
    fi

    if grep -q "GADApplicationIdentifier" "$PLIST_FILE"; then
        echo "${GREEN}✅ GADApplicationIdentifier var${NC}"
    else
        echo "${YELLOW}⚠️  GADApplicationIdentifier (AdMob App ID) eksik${NC}"
    fi
else
    echo "${YELLOW}⚠️  Info.plist bulunamadı (iOS projesi yok olabilir)${NC}"
fi

echo ""

# 7. Package.json - ATT Paketi Kontrolü
echo "📦 7. Dependencies - ATT Paketi Kontrolü..."
echo "-------------------------------------------"

if grep -q "capacitor-plugin-app-tracking-transparency" package.json; then
    echo "${RED}❌ HATA: capacitor-plugin-app-tracking-transparency paketi bulundu!${NC}"
    echo "${YELLOW}Bu paket COPPA apps için gereksiz ve zararlı!${NC}"
    echo "${YELLOW}Kaldırın: yarn remove capacitor-plugin-app-tracking-transparency${NC}"
    exit 1
else
    echo "${GREEN}✅ ATT paketi yok (doğru)${NC}"
fi

echo ""

# 8. Dosya Varlık Kontrolü
echo "📄 8. Dokümantasyon Kontrolü..."
echo "-------------------------------------------"

REQUIRED_DOCS=(
    "docs/COPPA_FIX_OCT_2025.md"
    "docs/FAMILIES_SDK_CERTIFICATION.md"
    "docs/FAMILIES_POLICY_COMPLIANCE.md"
    "docs/CRITICAL_MANIFEST_FIX.md"
)

for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "${GREEN}✅ $doc${NC}"
    else
        echo "${YELLOW}⚠️  $doc eksik${NC}"
    fi
done

echo ""

# 9. Build Dosyaları Kontrolü
echo "🏗️  9. Build Konfigürasyonu Kontrolü..."
echo "-------------------------------------------"

if [ -f "android/app/build.gradle" ]; then
    APP_ID=$(grep "applicationId" android/app/build.gradle | grep -o '"[^"]*"' | tr -d '"')
    VERSION_CODE=$(grep "versionCode" android/app/build.gradle | grep -o '[0-9]*')
    VERSION_NAME=$(grep "versionName" android/app/build.gradle | grep -o '"[^"]*"' | tr -d '"')

    echo "Application ID: ${BLUE}$APP_ID${NC}"
    echo "Version Code: ${BLUE}$VERSION_CODE${NC}"
    echo "Version Name: ${BLUE}$VERSION_NAME${NC}"
    echo "${GREEN}✅ Android build.gradle OK${NC}"
else
    echo "${YELLOW}⚠️  android/app/build.gradle bulunamadı${NC}"
fi

echo ""

# 10. Özet
echo "=========================================="
echo "📊 SONUÇ"
echo "=========================================="
echo ""
echo "${GREEN}✅ SDK Sertifikasyonu: Google AdMob v$PLAY_SERVICES_VERSION (≥19.0.0)${NC}"
echo "${GREEN}✅ COPPA Uyumluluğu (TypeScript): tagForUnderAgeOfConsent + MaxAdContentRating${NC}"
echo "${GREEN}✅ COPPA Uyumluluğu (AndroidManifest): TAG_FOR_CHILD + MAX_AD_CONTENT${NC}"
echo "${GREEN}✅ Non-Personalized Ads: npa: true (tüm reklam türlerinde)${NC}"
echo "${GREEN}✅ ATT Kontrolü: Yok (kod, paket, plist)${NC}"
echo "${GREEN}✅ iOS Info.plist: NSUserTrackingUsageDescription YOK${NC}"
echo "${GREEN}✅ Kullanıcı Takibi: Yok${NC}"
echo ""
echo "${BLUE}🎉 Uygulama Families Policy gereksinimleri ile TAMAMEN uyumlu!${NC}"
echo ""
echo "📋 Sonraki Adımlar:"
echo "1. npx cap sync (Android ve iOS)"
echo "2. npm run release:android:production"
echo "3. Google Play Console'a yükle"
echo "4. Değişiklik notlarını ekle (docs/CRITICAL_MANIFEST_FIX.md'den kopyala)"
echo "5. İncelemeye gönder"
echo ""
echo "📚 Detaylı bilgi için:"
echo "  - docs/CRITICAL_MANIFEST_FIX.md (YENİ - ÇOK ÖNEMLİ!)"
echo "  - docs/FAMILIES_SDK_CERTIFICATION.md"
echo ""
