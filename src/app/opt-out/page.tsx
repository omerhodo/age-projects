'use client';

export default function OptOutPage() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <main
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}
      >
        <div>
          <h1>Reklamları Devre Dışı Bırak / Opt Out of Ads</h1>

          <div style={{ marginBottom: '2rem' }}>
            <h2>Türkçe</h2>
            <p>
              Bu uygulama, deneyiminizi iyileştirmek için kişiselleştirilmiş
              reklamlar gösterir. Kişiselleştirilmiş reklamları devre dışı
              bırakmak isterseniz, aşağıdaki adımları takip edebilirsiniz:
            </p>

            <h3>Mobil Uygulama İçinde:</h3>
            <ol>
              <li>
                Uygulamanın alt kısmındaki &quot;Reklamları Devre Dışı
                Bırak&quot; bağlantısına tıklayın
              </li>
              <li>Onay mesajında &quot;Tamam&quot; butonuna basın</li>
              <li>Uygulama otomatik olarak yeniden yüklenecektir</li>
            </ol>

            <h3>Cihaz Ayarları Üzerinden:</h3>
            <h4>iOS Cihazlar:</h4>
            <ol>
              <li>Ayarlar &gt; Gizlilik ve Güvenlik &gt; Apple Advertising</li>
              <li>
                &quot;Kişiselleştirilmiş Reklamlar&quot; seçeneğini kapatın
              </li>
            </ol>

            <h4>Android Cihazlar:</h4>
            <ol>
              <li>
                Ayarlar &gt; Google &gt; Reklamlar &gt; Reklam Kişiselleştirme
              </li>
              <li>&quot;Reklam kişiselleştirme&quot; seçeneğini kapatın</li>
            </ol>

            <h3>Web Tarayıcısı Üzerinden:</h3>
            <p>
              Google Reklam Ayarları sayfasını ziyaret edin:{' '}
              <a
                href='https://adssettings.google.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#1976d2' }}
              >
                adssettings.google.com
              </a>
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2>English</h2>
            <p>
              This app shows personalized ads to enhance your experience. If you
              want to disable personalized ads, you can follow these steps:
            </p>

            <h3>Within the Mobile App:</h3>
            <ol>
              <li>
                Click on the &quot;Opt Out of Ads&quot; link at the bottom of
                the app
              </li>
              <li>Press &quot;OK&quot; in the confirmation message</li>
              <li>The app will automatically reload</li>
            </ol>

            <h3>Through Device Settings:</h3>
            <h4>iOS Devices:</h4>
            <ol>
              <li>
                Settings &gt; Privacy &amp; Security &gt; Apple Advertising
              </li>
              <li>Turn off &quot;Personalized Ads&quot;</li>
            </ol>

            <h4>Android Devices:</h4>
            <ol>
              <li>Settings &gt; Google &gt; Ads &gt; Ad Personalization</li>
              <li>Turn off &quot;Ad personalization&quot;</li>
            </ol>

            <h3>Through Web Browser:</h3>
            <p>
              Visit Google Ad Settings page:{' '}
              <a
                href='https://adssettings.google.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#1976d2' }}
              >
                adssettings.google.com
              </a>
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}
          >
            <h3>İletişim / Contact</h3>
            <p>
              Gizlilik konularında sorularınız varsa bizimle iletişime
              geçebilirsiniz:
              <br />
              If you have questions about privacy matters, you can contact us:
            </p>
            <p>
              <strong>Email:</strong> privacy@yourdomain.com
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleGoBack}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Geri Dön / Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
